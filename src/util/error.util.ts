import type { MySQL2Error } from "../types/error.types.js"


export const isMySQL2Error = (thrown: unknown): thrown is MySQL2Error => {
    return (
        typeof thrown === 'object' &&
        thrown !== null &&
        'errno' in thrown 
    )
}