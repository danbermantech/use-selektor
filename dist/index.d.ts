import { Context } from 'react';
export type SelectorFunction<State, Selected> = (state: State) => Selected;
export declare function useSelector<State, Selected>(selector: SelectorFunction<State, Selected>, context: Context<State>): Selected;
