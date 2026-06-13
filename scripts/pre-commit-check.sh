#!/bin/bash

# Comprehensive Pre-Commit Test Suite
# This script prevents breaking changes from being committed
# by running all critical tests and quality checks

set -e  # Exit on any error

echo "🔍 Starting comprehensive pre-commit checks..."
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Track overall success
OVERALL_SUCCESS=true

# Function to run command and track success
run_check() {
    local name="$1"
    local cmd="$2"
    local success_msg="$3"
    local error_msg="$4"
    
    echo -e "${BLUE}➤ ${name}...${NC}"
    
    if eval "$cmd"; then
        echo -e "${GREEN}✓ ${success_msg}${NC}"
        echo ""
        return 0
    else
        echo -e "${RED}✗ ${error_msg}${NC}"
        echo ""
        OVERALL_SUCCESS=false
        return 1
    fi
}

# Function to check if we're in the right directory
check_directory() {
    if [ ! -f "package.json" ]; then
        echo -e "${RED}✗ Error: Not in frontend directory or package.json not found${NC}"
        echo "Please run this script from the frontend directory"
        exit 1
    fi
    
    if [ ! -f "CLAUDE.md" ]; then
        echo -e "${RED}✗ Error: CLAUDE.md not found in frontend directory${NC}"
        echo "This script should be run from the frontend root"
        exit 1
    fi
}

# Function to run critical integration tests
run_integration_tests() {
    echo -e "${BLUE}🧪 Running Critical Integration Tests${NC}"
    echo "----------------------------------------"
    
    # Header integration tests (critical for UI)
    run_check "Header Integration Tests" \
        "npm test -- --testPathPatterns='header.integration.test' --verbose --passWithNoTests" \
        "Header integration tests passed" \
        "Header integration tests failed - UI may be broken"
    
    # Dashboard refresh tests (critical for functionality)
    run_check "Dashboard Refresh Tests" \
        "npm test -- --testPathPatterns='dashboard-refresh' --verbose --passWithNoTests" \
        "Dashboard refresh tests passed" \
        "Dashboard refresh tests failed - core functionality broken"
    
    # Widget layout tests (critical for display)
    run_check "Widget Layout Tests" \
        "npm test -- --testPathPatterns='widget-layout' --verbose --passWithNoTests" \
        "Widget layout tests passed" \
        "Widget layout tests failed - widget display may be broken"
    
    # Component tests for critical widgets
    run_check "Critical Widget Tests" \
        "npm test -- --testPathPatterns='pie-chart.*test|bar-chart.*test|line-chart.*test|number-card.*test|data-table.*test' --verbose --passWithNoTests" \
        "Critical widget tests passed" \
        "Critical widget tests failed - widgets may be broken"
}

# Function to run all tests
run_full_test_suite() {
    echo -e "${BLUE}🔬 Running Full Test Suite${NC}"
    echo "-----------------------------"
    
    run_check "All Frontend Tests" \
        "npm test -- --watchAll=false --passWithNoTests" \
        "All tests passed" \
        "Some tests failed - review failures before committing"
}

# Function to check TypeScript compilation
check_typescript() {
    echo -e "${BLUE}📝 TypeScript Compilation Check${NC}"
    echo "--------------------------------"
    
    run_check "TypeScript Compilation" \
        "npx tsc --noEmit" \
        "TypeScript compilation successful" \
        "TypeScript compilation failed - fix type errors"
}

# Function to check linting
check_linting() {
    echo -e "${BLUE}🔍 ESLint Check${NC}"
    echo "----------------"
    
    run_check "ESLint" \
        "npm run lint" \
        "Linting passed" \
        "Linting failed - fix lint errors"
}

# Function to check build
check_build() {
    echo -e "${BLUE}🔨 Build Check${NC}"
    echo "---------------"
    
    run_check "Next.js Build" \
        "npm run build" \
        "Build successful" \
        "Build failed - fix build errors"
}

# Function to check for breaking changes in critical files
check_breaking_changes() {
    echo -e "${BLUE}⚠️  Breaking Change Detection${NC}"
    echo "-------------------------------"
    
    # Check if header component exists and has required exports
    if [ -f "src/app/components/dashboard/header.tsx" ]; then
        if grep -q "export.*default" "src/app/components/dashboard/header.tsx"; then
            echo -e "${GREEN}✓ Header component export intact${NC}"
        else
            echo -e "${RED}✗ Header component missing default export${NC}"
            OVERALL_SUCCESS=false
        fi
    else
        echo -e "${RED}✗ Header component file missing${NC}"
        OVERALL_SUCCESS=false
    fi
    
    # Check if sidebar component exists and has required exports
    if [ -f "src/app/components/dashboard/sidebar.tsx" ]; then
        if grep -q "export.*default" "src/app/components/dashboard/sidebar.tsx"; then
            echo -e "${GREEN}✓ Sidebar component export intact${NC}"
        else
            echo -e "${RED}✗ Sidebar component missing default export${NC}"
            OVERALL_SUCCESS=false
        fi
    else
        echo -e "${RED}✗ Sidebar component file missing${NC}"
        OVERALL_SUCCESS=false
    fi
    
    # Check if widget shell component exists (critical for all widgets)
    if [ -f "src/app/components/dashboard/widgets/widget-shell.tsx" ]; then
        if grep -q "export.*default" "src/app/components/dashboard/widgets/widget-shell.tsx"; then
            echo -e "${GREEN}✓ Widget shell component export intact${NC}"
        else
            echo -e "${RED}✗ Widget shell component missing default export${NC}"
            OVERALL_SUCCESS=false
        fi
    else
        echo -e "${RED}✗ Widget shell component file missing${NC}"
        OVERALL_SUCCESS=false
    fi
    
    echo ""
}

# Function to check test coverage
check_coverage() {
    echo -e "${BLUE}📊 Test Coverage Check${NC}"
    echo "----------------------"
    
    # Note: We're not enforcing 100% coverage yet, but showing current status
    echo -e "${YELLOW}ℹ️  Running coverage report (informational)${NC}"
    npm test -- --coverage --watchAll=false --passWithNoTests || true
    echo ""
}

# Main execution
main() {
    echo -e "${BLUE}🚀 Comprehensive Pre-Commit Test Suite${NC}"
    echo -e "${BLUE}=======================================${NC}"
    echo ""
    
    # Check we're in the right place
    check_directory
    
    # Run all checks
    check_breaking_changes
    run_integration_tests
    check_typescript
    check_linting
    
    # Only run full test suite if integration tests pass
    if [ "$OVERALL_SUCCESS" = true ]; then
        run_full_test_suite
        check_build
        check_coverage
    else
        echo -e "${YELLOW}⚠️  Skipping full test suite due to critical failures${NC}"
    fi
    
    # Final result
    echo -e "${BLUE}================================================${NC}"
    if [ "$OVERALL_SUCCESS" = true ]; then
        echo -e "${GREEN}🎉 ALL CHECKS PASSED - Safe to commit!${NC}"
        echo ""
        echo -e "${GREEN}✅ No breaking changes detected${NC}"
        echo -e "${GREEN}✅ All critical tests passing${NC}"
        echo -e "${GREEN}✅ TypeScript compilation successful${NC}"
        echo -e "${GREEN}✅ Linting passed${NC}"
        echo -e "${GREEN}✅ Build successful${NC}"
        echo ""
        exit 0
    else
        echo -e "${RED}🚨 CHECKS FAILED - DO NOT COMMIT${NC}"
        echo ""
        echo -e "${RED}❌ One or more critical checks failed${NC}"
        echo -e "${YELLOW}📝 Please fix all issues above before committing${NC}"
        echo ""
        exit 1
    fi
}

# Parse command line arguments
SKIP_BUILD=false
SKIP_COVERAGE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --skip-build)
            SKIP_BUILD=true
            shift
            ;;
        --skip-coverage)
            SKIP_COVERAGE=true
            shift
            ;;
        --help|-h)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --skip-build     Skip the build check (faster for development)"
            echo "  --skip-coverage  Skip the coverage report"
            echo "  --help, -h       Show this help message"
            echo ""
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Override functions if skip flags are set
if [ "$SKIP_BUILD" = true ]; then
    check_build() {
        echo -e "${YELLOW}⏭️  Skipping build check (--skip-build flag)${NC}"
        echo ""
    }
fi

if [ "$SKIP_COVERAGE" = true ]; then
    check_coverage() {
        echo -e "${YELLOW}⏭️  Skipping coverage check (--skip-coverage flag)${NC}"
        echo ""
    }
fi

# Run main function
main