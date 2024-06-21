import { Slot,  } from "expo-router";
import Init from "../components/Init";
import { Provider } from "react-redux";
import { store } from "./store";
export default function HomeLayout() {
   
    return (
        <Provider store={store}>
            <Init />
            <Slot />
        </Provider>
    );
}
