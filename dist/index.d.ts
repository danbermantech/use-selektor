import { ReactNode } from 'react';
export type SelektorFunction<State, Selekted> = (state: State) => Selekted;
export type EqualityFunction<Selekted> = (a: Selekted, b: Selekted) => boolean;
export type SelektorContext<State> = {
    Provider: (props: {
        value: State;
        children?: ReactNode;
    }) => ReactNode;
    useSelektor: <Selekted>(selektor: SelektorFunction<State, Selekted>, isEqual?: EqualityFunction<Selekted>) => Selekted;
};
export declare function createSelektorContext<State>(...args: [] | [defaultValue: State]): SelektorContext<State>;
//# sourceMappingURL=index.d.ts.map