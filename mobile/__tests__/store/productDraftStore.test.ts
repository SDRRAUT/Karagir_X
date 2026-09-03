import { useProductDraftStore } from '@/store/useProductDraftStore';

describe('useProductDraftStore', () => {
  beforeEach(() => {
    useProductDraftStore.getState().resetDraft();
  });

  it('adds a photo and automatically sets the first as primary', () => {
    const store = useProductDraftStore.getState();
    const photoId = store.addPhoto({
      uri: 'file:///mock/front.jpg',
      angle: 'FRONT',
      quality: 'GOOD',
    });

    const state = useProductDraftStore.getState();
    expect(state.photos.length).toBe(1);
    expect(state.photos[0].id).toBe(photoId);
    expect(state.photos[0].angle).toBe('FRONT');
    expect(state.primaryPhotoId).toBe(photoId);
  });

  it('supports up to multiple photos and changing primary', () => {
    const store = useProductDraftStore.getState();
    const id1 = store.addPhoto({
      uri: 'file:///mock/1.jpg',
      angle: 'FRONT',
      quality: 'GOOD',
    });
    const id2 = store.addPhoto({
      uri: 'file:///mock/2.jpg',
      angle: 'TEXTURE',
      quality: 'GOOD',
    });

    let state = useProductDraftStore.getState();
    expect(state.photos.length).toBe(2);
    expect(state.primaryPhotoId).toBe(id1);

    store.setPrimaryPhoto(id2);
    state = useProductDraftStore.getState();
    expect(state.primaryPhotoId).toBe(id2);
  });

  it('updates enhanced photo URI', () => {
    const store = useProductDraftStore.getState();
    const id = store.addPhoto({
      uri: 'file:///mock/raw.jpg',
      angle: 'FRONT',
      quality: 'GOOD',
    });

    store.setEnhancedPhoto(id, 'file:///mock/enhanced.jpg');
    const state = useProductDraftStore.getState();
    expect(state.photos[0].isEnhanced).toBe(true);
    expect(state.photos[0].enhancedUri).toBe('file:///mock/enhanced.jpg');
  });

  it('removes a photo and updates primary if removed', () => {
    const store = useProductDraftStore.getState();
    const id1 = store.addPhoto({
      uri: 'file:///mock/1.jpg',
      angle: 'FRONT',
      quality: 'GOOD',
    });
    const id2 = store.addPhoto({
      uri: 'file:///mock/2.jpg',
      angle: 'TEXTURE',
      quality: 'GOOD',
    });

    store.removePhoto(id1);
    const state = useProductDraftStore.getState();
    expect(state.photos.length).toBe(1);
    expect(state.primaryPhotoId).toBe(id2);
  });
});
