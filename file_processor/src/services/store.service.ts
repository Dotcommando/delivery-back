import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';

import { AddressedErrorCatching, ApplyAddressedErrorCatching } from '../common/decorators';
import { IStorageActionStatus, IStorageData } from '../common/types';


@ApplyAddressedErrorCatching
@Injectable()
export class StoreService {
  private inMemoryStorage = new Map<string, unknown>();
  private defaultTTL: number = this.configService.get('ttl');

  constructor(
    private readonly configService: ConfigService,
    private schedulerRegistry: SchedulerRegistry,
  ) {
  }

  public set(id: string, data: unknown, options?: { ttl: number }): IStorageActionStatus {
    try {
      this.inMemoryStorage.set(id, data);
      typeof options?.ttl === 'number'
        ? this.prolongTimeoutForJobRemoving(id, options.ttl)
        : this.prolongTimeoutForJobRemoving(id);

      return { done: true };
    } catch (e) {
      return { done: false };
    }
  }

  public get(id: string): IStorageData {
    return {
      id,
      data: this.inMemoryStorage.get(id),
    };
  }

  public delete(id: string): IStorageActionStatus {
    try {
      this.inMemoryStorage.delete(id);

      return { done: true };
    } catch (e) {
      return { done: false };
    }
  }

  private addTimeoutForJobRemoving(jobId: string, milliseconds: number): void {
    const callback = () => {
      this.delete(jobId);
      console.log(`${jobId}    removed`);
    };

    const timeout = setTimeout(callback, milliseconds);
    this.schedulerRegistry.addTimeout(jobId, timeout);
    console.log(`${jobId}    set`);
  }

  private prolongTimeoutForJobRemoving(jobId: string, minutes = this.defaultTTL): void {
    const jobExists = this.schedulerRegistry.doesExist('timeout', jobId);
    const runInTime = minutes * 60 * 1000;

    if (jobExists) {
      this.schedulerRegistry.deleteTimeout(jobId);
      this.addTimeoutForJobRemoving(jobId, runInTime);
      console.log(`${jobId}    time reset`);

      return;
    }

    this.addTimeoutForJobRemoving(jobId, runInTime);
  }
}
