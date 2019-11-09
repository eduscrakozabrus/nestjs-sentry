import { Test } from '@nestjs/testing';

import { SentryModule  } from './sentry.module';
import { SentryModuleOptions, SentryOptionsFactory } from './interfaces/sentry-options.interface';
import { LogLevel } from '@sentry/types';
import { SentryService } from './services';
import { SENTRY_TOKEN } from './common/sentry.constants';

describe('SentryModule', () => {
    let config: SentryModuleOptions = {
        dsn: 'https://5bdf73a4da744fe1b3b6e13559bc8f6b@sentry.io/1513038',
        debug: true,
        environment: 'development',
        logLevel: LogLevel.Debug,
    }

    class TestService implements SentryOptionsFactory {
        createSentryModuleOptions(): SentryModuleOptions {
            return config;
        }
    }

    describe('forRoot', () => {
        it('should provide the sentry client', async() => {
            const mod = await Test.createTestingModule({
                imports: [SentryModule.forRoot(config)],
            }).compile();

            const sentry = mod.get<SentryService>(SENTRY_TOKEN);
            console.log('sentry', sentry);
            expect(sentry).toBeDefined();
            expect(sentry).toBeInstanceOf(SentryService);
        });
    });

    describe('forRootAsync', () => {
        describe('when the `useFactory` option is used', () => {
            it('should provide sentry client', async () => {
                const mod = await Test.createTestingModule({
                    imports: [
                        SentryModule.forRootAsync({
                            useFactory: () => (config),
                        }),
                    ]
                }).compile();

                const sentry = mod.get<SentryService>(SENTRY_TOKEN);
                expect(sentry).toBeDefined();
                expect(sentry).toBeInstanceOf(SentryService);
            });
        })
    });

    describe('when the `useClass` option is used', () => {
        it('should provide the sentry client', async () => {
            const mod = await Test.createTestingModule({
                imports: [
                    SentryModule.forRootAsync({
                        useClass: TestService
                    })
                ]
            }).compile();

            const sentry = mod.get<SentryService>(SENTRY_TOKEN);
            expect(sentry).toBeDefined();
            expect(sentry).toBeInstanceOf(SentryService);
        });
    });
})