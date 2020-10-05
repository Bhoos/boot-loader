import { Serializable, Serializer } from '@bhoos/serialization';
import { Options } from './types';

export class App implements Serializable {
  type: string; // production | staging | development
  app: string; // The name of the app
  version: string; // The app version
  owner: string; // the name of the github owner
  repo: string; // The github repo
  maxClones: number;
  currentClone: number;

  constructor(app?: string, owner?: string, repo?: string, version?: string, maxClones?: number) {
    this.type = process.env.NODE_ENV || 'development';
    this.currentClone = parseInt(process.env.APP_CLONE_NUM) || 0;
    this.app = app;
    this.version = version;
    this.owner = owner;
    this.repo = repo || app;
    this.maxClones = maxClones;
  }

  serialize(serializer: Serializer) {
    this.type = serializer.string(this.type);
    this.repo = serializer.string(this.repo);
    this.owner = serializer.string(this.owner);
    this.app = serializer.string(this.app);
    this.version = serializer.string(this.version);
    this.maxClones = serializer.int16(this.maxClones);
    this.currentClone = serializer.int16(this.currentClone);
  }

  static create(app: string, version: string,  owner: string, repo?: string, maxClones=2) {
    return new App(app, owner, repo, version, maxClones);
  }
}
