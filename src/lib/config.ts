import { doc, getDoc } from "firebase/firestore/lite";
import { db } from "./firebase";

export async function checkConfig() {
    const id = "0.0.1"
    const ref = doc(db, "app", id)
    return getDoc(ref)
}