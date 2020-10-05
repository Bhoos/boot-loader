import { Oracle } from '@bhoos/serialization';
import { App } from './App';
import { Trigger } from './Trigger';
import { Status } from './Status';

export function getOracle() {
  const oracle = new Oracle();
  oracle.register(1, App, () => new App());
  oracle.register(2, Trigger, () => new Trigger());
  oracle.register(3, Status, () => new Status());
  return oracle;
}
