import Worker from './preload.font.worker.js'
import { isSlowConnection, unlockClasses } from '../utils/fontLoader';

const {sources, classes} = <%= options.workerData %>;
const prefetchCount = <%= options.prefetchCount %>;
const unlockDelay = <%= options.unlockDelay %>;

if (!isSlowConnection(<%= JSON.stringify(options.ignoredEffectiveTypes) %>)) {

  const worker = new Worker()
  worker.postMessage(Object.assign({ baseUrl: getBaseUrl(), prefetchCount, sources }))
  worker.addEventListener('message', function ({data}) {
    if (data.prefetched) {
      unlockClasses(classes, unlockDelay);
    }
  })

}


function getBaseUrl(){
  return global.location.protocol + '//' + global.location.host
}
