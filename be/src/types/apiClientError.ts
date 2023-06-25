import { ApiClientError } from "shared/types";



export class ApiClientErrorError extends Error {
    code: string
  
    constructor(message: string, code: string) {
      super(message);
  
      this.code = code;
  
      Object.setPrototypeOf(this, ApiClientErrorError.prototype);
    }
  
    unClass(): ApiClientError {
      return {
        code: this.code,
        message: this.message,
      }
    }
  }