export const getGlist = (glist) => {
    let res = [
        { name: 'DB', value: [] },
        { name: 'G1', value: [] },
        { name: 'G2', value: [] },
        { name: 'G3', value: [] },
        { name: 'G4', value: [] },
        { name: 'G5', value: [] },
        { name: 'G6', value: [] },
        { name: 'G7', value: [] },
        { name: 'G8', value: [] },
    ]
    let arr = glist.reduce((sum, item, index) => {
        if (index < 1) {
            res[0].value.push(item)
        } else if (index < 2) {
            res[1].value.push(item)
        } else if (index < 3) {
            res[2].value.push(item)
        } else if (index < 5) {
            res[3].value.push(item)
        } else if (index < 12) {
            res[4].value.push(item)
        } else if (index < 13) {
            res[5].value.push(item)
        } else if (index < 16) {
            res[6].value.push(item)
        } else if (index < 17) {
            res[7].value.push(item)
        } else if (index < 18) {
            res[8].value.push(item)
        }
        return sum
    }, res)
    return arr
}

export const getGlistr = (glist) => {
    let res = [
        { name: 'G8', value: [] },
        { name: 'G7', value: [] },
        { name: 'G6', value: [] },
        { name: 'G5', value: [] },
        { name: 'G4', value: [] },
        { name: 'G3', value: [] },
        { name: 'G2', value: [] },
        { name: 'G1', value: [] },
        { name: 'DB', value: [] },
    ]
    let arr = glist.reduce((sum, item, index) => {
        if (index < 1) {
            res[0].value.push(item)
        } else if (index < 2) {
            res[1].value.push(item)
        } else if (index < 5) {
            res[2].value.push(item)
        } else if (index < 6) {
            res[3].value.push(item)
        } else if (index < 13) {
            res[4].value.push(item)
        } else if (index < 15) {
            res[5].value.push(item)
        } else if (index < 16) {
            res[6].value.push(item)
        } else if (index < 17) {
            res[7].value.push(item)
        } else if (index < 18) {
            res[8].value.push(item)
        }
        return sum
    }, res)
    return arr
}
