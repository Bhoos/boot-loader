import { Serializable, Serializer } from '@bhoos/serialization';

export class Trigger implements Serializable {
  startReplacement: boolean;

  constructor(startReplacement?: boolean) {
    this.startReplacement = startReplacement;
  }

  serialize(serializer: Serializer) {
    this.startReplacement = serializer.bool(this.startReplacement);
  }
}
