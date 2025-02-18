# Code Citations

## License: MIT

https://github.com/sarmentow/momentum/tree/0011c04040e8319edf0fad4c63343090a0739d62/src/components/Navbar/index.js

```
useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
```
