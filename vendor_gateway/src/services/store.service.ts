import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';

import * as cloneDeep from 'lodash.clonedeep';

import { AddressedErrorCatching, ApplyAddressedErrorCatching } from '../common/decorators';
import { IStorageActionStatus, IStorageData } from '../common/types';


@ApplyAddressedErrorCatching
@Injectable()
export class StoreService {
  private inMemoryStorage = new Map<string, unknown>();
  private defaultTTL: number = this.configService.get('ttl');
  private schedulerJobPrefix = 'store-';

  constructor(
    private readonly configService: ConfigService,
    private schedulerRegistry: SchedulerRegistry,
  ) {
  }

  public set(id: string, data: unknown, options?: { ttl: number }): IStorageActionStatus {
    try {
      ((typeof data === 'object') && Boolean(data)) || typeof data === 'function'
        ? this.inMemoryStorage.set(id, cloneDeep(data))
        : this.inMemoryStorage.set(id, data);
      typeof options?.ttl === 'number'
        ? this.prolongTimeoutForJobRemoving(id, options.ttl)
        : this.prolongTimeoutForJobRemoving(id);

      return { done: true };
    } catch (e) {
      return { done: false };
    }
  }

  public get(id: string): IStorageData {
    const data: unknown = this.inMemoryStorage.get(id);

    return ((typeof data === 'object') && Boolean(data)) || typeof data === 'function'
      ? { id, data: cloneDeep(data) }
      : { id, data };
  }

  public delete(id: string): IStorageActionStatus {
    try {
      this.inMemoryStorage.delete(id);
      this.clearPlannedJobs(id);

      return { done: true };
    } catch (e) {
      return { done: false };
    }
  }

  public has(id: string): boolean {
    return this.inMemoryStorage.has(id);
  }

  private clearPlannedJobs(id: string): void {
    const schedulerJobId = this.schedulerJobPrefix + id;

    if (this.schedulerRegistry.doesExist('timeout', schedulerJobId)) {
      this.schedulerRegistry.deleteTimeout(schedulerJobId);
    }

    if (this.schedulerRegistry.doesExist('interval', schedulerJobId)) {
      this.schedulerRegistry.deleteInterval(schedulerJobId);
    }

    if (this.schedulerRegistry.doesExist('cron', schedulerJobId)) {
      this.schedulerRegistry.deleteCronJob(schedulerJobId);
    }
  }

  private addTimeoutForJobRemoving(jobId: string, milliseconds: number): void {
    const callback = () => {
      this.delete(jobId);
      console.log(`${jobId}    removed`);
    };

    const timeout = setTimeout(callback, milliseconds);
    this.schedulerRegistry.addTimeout(this.schedulerJobPrefix + jobId, timeout);
    console.log(`${jobId}    set`);
  }

  private prolongTimeoutForJobRemoving(jobId: string, minutes = this.defaultTTL): void {
    const schedulerJobId = this.schedulerJobPrefix + jobId;
    const jobExists = this.schedulerRegistry.doesExist('timeout', schedulerJobId);
    const runInTime = minutes * 60 * 1000;

    if (jobExists) {
      this.schedulerRegistry.deleteTimeout(schedulerJobId);
      this.addTimeoutForJobRemoving(jobId, runInTime);
      console.log(`${jobId}    time reset`);

      return;
    }

    this.addTimeoutForJobRemoving(jobId, runInTime);
  }
}
