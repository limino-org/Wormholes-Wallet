// Generate random colors
export const getRandomColor = () => {    
    var r = Math.floor(Math.random() * (200 - 50 + 1)) + 50;
    var g = Math.floor(Math.random() * (200 - 50 + 1)) + 50;
    var b = Math.floor(Math.random() * (250 - 150 + 1)) + 150;
    var color = '#'+r.toString(16)+g.toString(16)+b.toString(16);
    return color
 }


 var colors = [
    '#8473C6',
    '#DBBB9A',
    '#84BED4',
    '#6F99D2',
    '#9EDB90'
]


export interface IconData{
    list: Array<any>
    color: string
}

export const getRandomIcon = () => {
    let data = []
    for (let i = 0; i < 5; i++) {
        data.push([
            Math.floor(Math.random() * 2),
            Math.floor(Math.random() * 2),
            Math.floor(Math.random() * 2)
        ])
    }
    data = data.map(function(d) {
            d.push(d[1], d[0])
            return d
        })
        // duplicate first two rows
    var color = colors[Math.floor(Math.random() * colors.length)]
    const res:IconData = {
        list: data,
        color
    }
    return res
}



//Generate a globally unique identifier
export function guid() {
    function S4() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}