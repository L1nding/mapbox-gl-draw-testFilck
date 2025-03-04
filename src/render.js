import * as Constants from './constants.js';

export default function render() {
  // eslint-disable-next-line no-invalid-this
  const store = this;
  const { ctx } = store;
  const { map, events } = ctx;
  const sourceId = Constants.source;
  const mapExists = map && map.getSource(sourceId) !== undefined;

  const cleanup = () => {
    store.isDirty = false;
    store.clearChangedIds();
  };

  if (!mapExists) return cleanup();

  const mode = events.currentModeName();
  // ctx.ui.queueMapClasses({ mode });

  const newIds = store.getAllIds();
  const lastCount = store.source.length;
  const newFeatures = [];

  for (const id of newIds) {
    const feature = store.get(id);
    const featureInternal = feature.internal(mode);
    events.currentModeRender(featureInternal, (geojson) => {
      geojson.properties.mode = mode;
      newFeatures.push(geojson);
    });
  }

  store.source = newFeatures;
  const hasChanges = lastCount !== newIds.length || newIds.length > 0;

  if (hasChanges) {
    const source = map.getSource(sourceId);
    source.setData({
      type: Constants.geojsonTypes.FEATURE_COLLECTION,
      features: newFeatures
    });
  }

  cleanup();
}
