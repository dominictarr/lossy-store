# lossy-store

simple mini database that does not promise durability, for when you do not need it!

It's a key value store, and each value is a file. Each value is stored in it's own file.

## api

### store = LossyStore(dir, codec?)

create a lossy store with the given [codec](https://www.npmjs.com/package/flumecodec)
(or JSON by default) at the `dir`

### store.has(key)

returns true if this key is currently in the store.

### store.ensure(key, cb)

ensure that this key is loaded from the file system.
if the file has already been read, `cb` is called immediately.
if `set` is called while waiting for the filesystem, `cb` is called immediately.

### store.get (key, cb)

get the current value for key, loading it if necessary

### store.get (key) => value

return the currently set `value` for `key`. may be null.

### store.set(key, value)

Set a new value. this will trigger a write to be performed (at some point)

## License

MIT
