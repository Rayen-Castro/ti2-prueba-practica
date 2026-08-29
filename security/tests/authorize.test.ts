 import { describe, it, expect } from "vitest"; 
 import { checkAccess } from "../src/checkAccess"; 
 
 describe("checkAccess", () => { it("permite a un student ver su propia atención", 
    () => { expect(checkAccess("u1", "a1").allowed).toBe(true); }); 
    it("deniega a un student ver la atención de otro", 
        () => { expect(checkAccess("u2", "a1").allowed).toBe(false); }); 
        it("permite a un professional ver una atención asignada", 
            () => { expect(checkAccess("u3", "a1").allowed).toBe(true); }); 
            it("deniega a un professional ver una atención no asignada", 
                () => { expect(checkAccess("u3", "a3").allowed).toBe(false); }); });