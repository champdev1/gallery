import { useCallback } from 'react';
import { mutate } from 'swr';
import cloneDeep from 'lodash.clonedeep';
import usePost from '../_rest/usePost';
import { useAuthenticatedUser } from '../users/useUser';
import { GetGalleriesResponse } from '../galleries/types';
import { getGalleriesCacheKey } from '../galleries/useGalleries';
import {
  UpdateCollectionInfoRequest,
  UpdateCollectionInfoResponse,
} from './types';

export default function useUpdateCollectionInfo() {
  const updateCollection = usePost();
  const authenticatedUser = useAuthenticatedUser();

  return useCallback(
    async (collectionId: string, name: string, collectors_note: string) => {
      await updateCollection<
      UpdateCollectionInfoResponse,
      UpdateCollectionInfoRequest
      >('/collections/update/info', 'update collection info', {
        id: collectionId,
        name,
        collectors_note,
      });

      // Optimistically update the collection within gallery cache.
      // it should be less messy in the future when we have a dedicated
      // endpoint for individual collections
      await mutate(
        getGalleriesCacheKey({ userId: authenticatedUser.id }),
        (value: GetGalleriesResponse) => {
          const newValue = cloneDeep<GetGalleriesResponse>(value);
          const gallery = newValue.galleries[0];
          const newCollections = gallery.collections.map(collection => {
            if (collection.id === collectionId) {
              return { ...collection, name, collectors_note };
            }

            return collection;
          });
          newValue.galleries[0].collections = newCollections;
          return newValue;
        },
        false,
      );
    },
    [authenticatedUser, updateCollection],
  );
}
