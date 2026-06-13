import { checkConnection } from '@/app/db';
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export async function GET() {
  const result = await checkConnection();
  return Response.json(result);
}

export async function POST(req: Request) {
  // const { prompt } = await req.json();
  // const result = streamText({
  //   model: google('gemini-2.5-flash'),
  //   prompt,
  // });
  // return result.toTextStreamResponse();
}
