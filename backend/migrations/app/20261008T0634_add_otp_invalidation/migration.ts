#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/7bb539b94b45fe5d43f5f04e62d5dce83c08587ad76fee07aff5b1504db4f6c3/contract';
import startContract from '../../snapshots/7bb539b94b45fe5d43f5f04e62d5dce83c08587ad76fee07aff5b1504db4f6c3/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/b697d8a88d5066ad95f934d218b424fad77f443f1eb431142c76f3927099ea4d/contract';
import endContract from '../../snapshots/b697d8a88d5066ad95f934d218b424fad77f443f1eb431142c76f3927099ea4d/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'OtpVerification',
        column: col('invalidatedAt', 'timestamptz', {
          codecRef: { codecId: 'pg/timestamptz-temporal@1' },
        }),
      }),
      this.createIndex({
        schema: 'public',
        table: 'OtpVerification',
        index: 'OtpVerification_expiresAt_idx_6b6b8c10',
        columns: ['expiresAt'],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
