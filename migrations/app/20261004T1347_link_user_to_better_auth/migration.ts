#!/usr/bin/env -S node
import 'temporal-polyfill/full/global';
import type { Contract as End } from '../../snapshots/07186828686cf95663bae27354649d403aee3d4f5135743bf962ce7d95ef5587/contract';
import endContract from '../../snapshots/07186828686cf95663bae27354649d403aee3d4f5135743bf962ce7d95ef5587/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/6879ad2b912cc756bfd90df085c7363ffa05ab344f11565a591c8bcdae36c332/contract';
import startContract from '../../snapshots/6879ad2b912cc756bfd90df085c7363ffa05ab344f11565a591c8bcdae36c332/contract.json' with { type: 'json' };
import postgres from '@prisma/orm-postgres/runtime';
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';

const { sql: db, contract } = postgres<End>({ contractJson: endContract });

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'User',
        column: col('authUserId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.dataTransform(contract, 'backfill-User-authUserId', {
        check: () =>
          db.public.User
            .select('id')
            .where((f, fns) =>
              fns.eq(f.authUserId, null),
            )
            .limit(1),
        run: () =>
          db.public.User
            .update({ authUserId: '02veKtwULQOP8Rv79Z6rTCVRsQ6jQwfu' })
            .where((f, fns) =>
              fns.eq(f.id, '2067705f-5a40-4b4e-b2e2-92945b8684c0'),
            ),
      }),
      this.setNotNull({ schema: 'public', table: 'User', column: 'authUserId' }),
      this.addUnique({
        schema: 'public',
        table: 'User',
        constraint: 'User_authUserId_key',
        columns: ['authUserId'],
      }),
      this.dropColumn({ schema: 'public', table: 'User', column: 'passwordHash' }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
