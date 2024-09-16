# useSelektor

![sizeMin](https://img.shields.io/bundlephobia/min/use-selektor)
![sizeMinZip](https://img.shields.io/bundlephobia/minzip/use-selektor)
![languages](https://img.shields.io/github/languages/top/danbermantech/use-selektor)
![GitHub package.json version](https://img.shields.io/github/package-json/v/danbermantech/use-selektor)
![NPM License](https://img.shields.io/npm/l/use-selektor)


useSelektor is a powerful React hook designed to simplify data extraction from complex contexts. By leveraging this hook, you can selectively access specific data slices without causing unnecessary rerenders, ensuring optimized performance. With full type safety and zero dependencies, useSelektor enhances your React components by providing a streamlined and efficient way to manage and use context values.

## Features

- 🦺Fully typesafe
- 🛑Stops unneccessary rerenders when context value changes
- 🤏Zero dependencies
- 🩻Named after He-Man's primary antagonist

## Usage

1. **Create Contexts:** Define contexts with complex data structures.
2. **Define a Selektor Function:** Implement a function to specify which part of the context you need.
3. **Use `useSelektor` Hook:** Call `useSelektor` with your selektor function and the relevant context.

### Example

```tsx
import { useSelektor } from 'use-selektor';
import { createContext } from 'react';

// Define your data types
type ComplexType = {
    id: string,
    label:string,
    value:number
    attributes: {
        width:number,
        height:number
    }
}

type ComplexRecord = Record<string, ComplexType>


// Create some example data
const foo:ComplexType = {
    id:'1', label:'foo', value:100,
    attributes:{
        width:10, height:10
    }
}

const bar:ComplexType = {
    id:'2', label:'bar', value:200,
    attributes:{
        width:50, height:50
    }
}

const itemRecord:ComplexRecord = {
    foo,
    bar,
    //{...etc}
}

// Create your contexts
const MyContext = createContext<ComplexType>(foo)

const MyRecordContext = createContext<ComplexRecord>(itemRecord)


// Create your custom hooks for easier reuse
function useMyContext<T>(selektor: (args: ComplexType) => T) {
    return useSelektor(selektor, MyContext)
}

function useMyRecordContext<T>(selektor: (args: ComplexRecord) => T) {
    return useSelektor(selektor, MyContext)
}


// Example components using these hooks to consume the contexts
const MyComponent = () =>{
    const id = useMyContext(({id})=>id);
    const label = useMyContext(context=>context.label);
    const {width, height} = useMyContext(context=>(context.attributes));
    
    return (
        <div id={id} style={{width, height}}>
            {label}
        </div>
    )
}

const MyRecordComponent = ({id}:{id:string}) =>{
    const {label, attributes:{width, height}} = useMyRecordContext(context=>context[id])
    return (
        <div id={id} style={{width,height}}>
            {label}
        </div>
    )
}

// Providing context and rendering components
const App = ({data}:{data:ComplexType})=>{
    return (
        <MyContext.Provider value={data}>
            <MyComponent/>
            {
                ['foo','bar'].map(k=>(
                    <MyRecordComponent id={k}/>
                ))
            }
        </MyContext.Provider>
    )
}
```


## License

`use-selektor` is licensed under the ISC License. See the [LICENSE](LICENSE) file for more details.

## Additional Resources

- [GitHub Repository](https://github.com/DanBermanTech/use-selektor) – Source code and issue tracking.

Thank you for choosing `use-selektor`. May your schemas be consistent and your renders infrequent