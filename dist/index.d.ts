import { Context } from 'react';
export type SelektorFunction<State, Selekted> = (state: State) => Selekted;
export declare function useSelektor<State, Selekted>(selektor: SelektorFunction<State, Selekted>, context: Context<State>): Selekted;
