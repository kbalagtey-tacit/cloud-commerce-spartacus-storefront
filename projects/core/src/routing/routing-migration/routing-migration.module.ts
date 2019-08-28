import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { Config } from '../../config/config.module';
import { RoutingMigrationConfig } from './routing-migration-config';
import { addMigrationRoutesFactory } from './routing-migration.providers';
import {
  GlobHelperService,
  RoutingMigrationService,
} from './routing-migration.service';

/**
 * Prepends the migration route that redirects to a different storefront system for configured URLs
 */
@NgModule()
export class RoutingMigrationModule {
  static forRoot(): ModuleWithProviders<RoutingMigrationModule> {
    return {
      ngModule: RoutingMigrationModule,
      providers: [
        GlobHelperService, //spike todo move somewhere else
        RoutingMigrationService,
        { provide: RoutingMigrationConfig, useExisting: Config },
        {
          provide: APP_INITIALIZER,
          multi: true,
          useFactory: addMigrationRoutesFactory,
          deps: [RoutingMigrationService],
        },
      ],
    };
  }
}