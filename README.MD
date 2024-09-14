# useSelektor

- Extract specific data from complex contexts

## Features

- Fully typesafe
- Only triggers rerenders when the selected data updates
- Named after Skeletor

## Usage

```tsx
import { useSelektor } from 'use-selektor';
import { createContext } from 'react';

type ComplexType = {
    id: string,
    label:string,
    value:number
    attributes: {
        width:number,
        height:number
    }
}

const MyContext = createContext<ComplexType>({
    id:'1',
    label:'myLabel',
    value:100,
    attributes:{
        width:10,
        height:10
    }
})

function useMyContext<T>(selektor: (args: ComplexType) => T) {
    return useSelektor(selektor, MyContext)
}

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

const App = ({data}:{data:ComplexType})=>{
    return (
        <MyContext.Provider value={data}>
            <MyComponent/>
        </MyContext.Provider>
    )
}
```