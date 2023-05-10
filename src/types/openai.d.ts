/**
 * OpenAI API 声明
 */

declare namespace OpenAI {
  namespace ChatCompletions {
    interface Request {
      token: string,
      host: string,
      model: import('@/constants').Model,
      messages: IMessage[],
    }

    interface Message {
      role: import('@/constants').Role,
      content: string,
      name?: string,
    }

    interface Response {
      id: string,
      object: string,
      created: number,
      choices: {
        index: number,
        message: {
          role: import('@/constants').Role,
          content: string,
        }
        finish_reason: string,
      }[],
      usage: {
        prompt_tokens: number,
        completion_tokens: number,
        total_tokens: number,
      }
    }
  }
}
