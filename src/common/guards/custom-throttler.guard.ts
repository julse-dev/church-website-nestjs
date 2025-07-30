import { Injectable, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
    protected async throwThrottlingException(context: ExecutionContext): Promise<void> {
        const request = context.switchToHttp().getRequest();

        throw new HttpException({
            statusCode: HttpStatus.TOO_MANY_REQUESTS,
            message: 'Too many requests. Please try again later.',
            timestamp: new Date().toISOString(),
            path: request.url,
        }, HttpStatus.TOO_MANY_REQUESTS);
    }
}
