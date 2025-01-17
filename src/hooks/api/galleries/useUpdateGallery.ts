import cloneDeep from 'lodash.clonedeep';
import { useCallback } from 'react';
import { mutate } from 'swr';
import { Collection } from 'types/Collection';
import { useAuthenticatedUser } from '../users/useUser';
import usePost from '../_rest/usePost';
import {
  GetGalleriesResponse,
  UpdateGalleryRequest,
  UpdateGalleryResponse,
} from './types';
import { getGalleriesCacheKey } from './useGalleries';

function mapCollectionsToCollectionIds(collections: Collection[]) {
  return collections.map(collection => collection.id);
}

export default function useUpdateGallery() {
  const updateGallery = usePost();
  const authenticatedUser = useAuthenticatedUser();

  return useCallback(
    async (galleryId: string, collections: Collection[]) => {
      await updateGallery<UpdateGalleryResponse, UpdateGalleryRequest>(
        '/galleries/update',
        'update gallery',
        {
          id: galleryId,
          collections: mapCollectionsToCollectionIds(collections),
        },
      );

      void mutate(
        getGalleriesCacheKey({ userId: authenticatedUser.id }),
        (value: GetGalleriesResponse) => {
          const newValue = cloneDeep<GetGalleriesResponse>(value);
          newValue.galleries[0].collections = collections;
          return newValue;
        },
        false,
      );
    },
    [authenticatedUser.id, updateGallery],
  );
}
