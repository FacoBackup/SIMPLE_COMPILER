export default Object.freeze({
    READ: "+10",
    WRITE: "+11",
    LOAD: "+20",
    STORE: "+21",
    ADD: "+30",
    SUBTRACT: "+31",
    DIVIDE: "+32",
    MULTIPLY: "+33",
    MODULE: "+34",
    BRANCH: "+40",
    BRANCH_NEG: "+41",
    BRANCH_ZERO: "+42",
    HALT: "+4300",
    getName(value: string) {
        const entries = Object.entries(this) as [string, any] as [string, string];
        return entries.find(e => e[1].includes(value))?.[0];
    }
})
