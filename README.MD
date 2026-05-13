# useSelektor

![sizeMin](https://img.shields.io/bundlephobia/min/use-selektor)
![sizeMinZip](https://img.shields.io/bundlephobia/minzip/use-selektor)
![languages](https://img.shields.io/github/languages/top/danbermantech/use-selektor)
![GitHub package.json version](https://img.shields.io/github/package-json/v/danbermantech/use-selektor)
![NPM License](https://img.shields.io/npm/l/use-selektor)


useSelektor is a React context-selector utility for reading only the slice of state a component needs. It uses a subscription model so consumer components update when their selected value changes, not when unrelated context keys change.

## Features

- Fully typesafe selector API
- Prevents selector consumers from rerendering on unrelated state updates
- Custom equality support for derived selector output
- Named after He-Man's primary antagonist

## Usage

1. Create a selector-aware context with `createSelektorContext`.
2. Render its `Provider` with the current state value.
3. Read slices with `YourContext.useSelektor(selector, isEqual?)`.

### Example

```tsx
import { createSelektorContext } from 'use-selektor'
import { useMemo, useState } from 'react'

type Item = {
    id: string
    label: string
    value: number
}

type AppState = {
    items: Record<string, Item>
    selectedId: string
    theme: 'light' | 'dark'
}

const AppContext = createSelektorContext<AppState>()

function ItemTitle() {
    const title = AppContext.useSelektor(state => state.items[state.selectedId].label)
    return <h2>{title}</h2>
}

function ThemeBadge() {
    const theme = AppContext.useSelektor(state => state.theme)
    return <span>{theme}</span>
}

export function App() {
    const [state, setState] = useState<AppState>({
        items: {
            a: { id: 'a', label: 'Alpha', value: 1 },
            b: { id: 'b', label: 'Beta', value: 2 },
        },
        selectedId: 'a',
        theme: 'light',
    })

    const value = useMemo(() => state, [state])

    return (
        <AppContext.Provider value={value}>
            <ItemTitle />
            <ThemeBadge />
            <button
                onClick={() => {
                    setState(prev => ({ ...prev, theme: prev.theme === 'light' ? 'dark' : 'light' }))
                }}
            >
                Toggle Theme
            </button>
        </AppContext.Provider>
    )
}
```

## Custom Equality

Use `isEqual` when your selector returns derived objects:

```tsx
const userPreview = UserContext.useSelektor(
    state => ({ id: state.user.id, name: state.user.name }),
    (a, b) => a.id === b.id && a.name === b.name
)
```

## Migration from v1

`useSelektor(selector, reactContext)` has been removed in v2.

Legacy:
```tsx
const result = useSelektor(selector, SomeReactContext)
```

V2:
```tsx
const SomeContext = createSelektorContext<State>()

function Child() {
    const result = SomeContext.useSelektor(selector)
    return <>{result}</>
}
```

Replace plain React context + standalone hook usage with the factory-generated provider and hook pair.


## License

`use-selektor` is licensed under the ISC License. See the [LICENSE](LICENSE) file for more details.

## Additional Resources

- [GitHub Repository](https://github.com/DanBermanTech/use-selektor) – Source code and issue tracking.

Thank you for choosing `use-selektor`. May your schemas be consistent and your renders infrequent