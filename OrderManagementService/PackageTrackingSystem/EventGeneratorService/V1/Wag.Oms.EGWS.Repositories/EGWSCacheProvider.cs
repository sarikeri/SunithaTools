using System.Collections.Generic;
using System.Runtime.Caching;
using Wag.Oms.EGWS.RepositoryContracts.Interfaces;

namespace Wag.Oms.EGWS.Repositories
{
    public static class EGWSCacheProvider
    {
        public static IEnumerable<T> Get<T>(string cacheName, IDalBaseRepository<T> repository)
        {
            ObjectCache cache = MemoryCache.Default;
            IEnumerable<T> entities;
            var cachedEntities = cache.Get(cacheName);
            if (cachedEntities == null)
            {
                entities = repository.Get();
                cache.Set(cacheName, entities, ObjectCache.InfiniteAbsoluteExpiration);
            }
            else
            {
                entities = (IEnumerable<T>)cachedEntities;
            }
            return entities;
        }
    }
}
