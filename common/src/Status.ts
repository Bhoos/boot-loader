import { Serializable, Serializer } from '@bhoos/serialization';

export class Status implements Serializable {
  status: string;

  constructor(status?: string) {
    this.status = status;
  }

  serialize(serializer: Serializer) {
    this.status = serializer.string(this.status);
  }
}