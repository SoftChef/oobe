let JsdocArtist = require('./jda')
let JDA = new JsdocArtist()

JDA.setCompile((data) => {
    let anchors = []
    let newData = []
    let list = []
    let index = 0
    let len = data.data.length
    for (let i = 0; i < len; i++) {
        let d = data.data[i]
        if (d.name === 'class') {
            index += 1
        }
        if (list[index] == null) {
            list[index] = []
        }
        list[index].push(d)
    }
    list = list.filter((t) => { return t })
    for (let i = 0; i < list.length; i++) {
        var classs = []
        var members = []
        var functions = []
        var target = null
        for (let j = 0; j < list[i].length; j++) {
            var aims = list[i][j]
            if (aims.name === 'class') {
                anchors.push(`[${aims.data.name}](#remd-me-${aims.data.name.toLowerCase().replace(/\(|\)|,/g, '-')})`)
                classs.push(aims)
                target = classs
            } else if (aims.name === 'member') {
                members.push(aims)
                target = members
            } else if (aims.name === 'function') {
                functions.push(aims)
                target = functions
            } else if (target) {
                target.push(aims)
            }
        }
        classs.push('***')
        if (members.length !== 0) {
            members.unshift('### Member')
        }
        if (functions.length !== 0) {
            functions.unshift('### Function')
        }
        newData[i] = classs.concat(members).concat(functions)
    }
    let output = []
    for (let i = 0; i < newData.length; i++) {
        output = output.concat(newData[i])
    }
    data.text = output.map((d) => {
        return typeof d !== 'string' ? d.output : d
    }).join('\n')
    data.text = '# 目錄 : \n\n' + anchors.join('\n\n') + '\n\n' + data.text
    return data
})

JDA.register('class', {
    temp: ['name'],
    output: function(data) {
        return `## ${data.name}`
    }
})

JDA.register('static', {
    temp: [],
    output: function(data) {
        return `<span style="border-radius:3px; display:inline-block; margin-bottom:12px ; background-color:#687489; color:#FFF; padding:2px 6px; text-align:center">static</span>\n`
    }
})

JDA.register('async', {
    temp: [],
    output: function(data) {
        return `<span style="border-radius:3px; display:inline-block; margin-bottom:12px ; background-color:#687489; color:#FFF; padding:2px 6px; text-align:center">async</span>\n`
    }
})

JDA.register('private', {
    temp: [],
    output: function(data) {
        return `<span style="border-radius:3px; display:inline-block; margin-bottom:12px ; background-color:red; color:#FFF; padding:3px 6px; text-align:center">private</span><br>`
    }
})

JDA.register('member', {
    temp: ['type', 'name', 'desc'],
    output: function(data) {
        return `<font color="#e30090">${data.name}</font> - <span style="padding:3px; display:inline-block; color:#8c83af">__${data.type.slice(1, -1)}__</span>\n\n ${data.desc}\n\n`
    }
})

JDA.register('function', {
    temp: ['func'],
    output: function(data) {
        return `#### ${data.func}`
    }
})

JDA.register('argument', {
    temp: ['name', 'desc'],
    output: function(data) {
        return `### <span style="color:cyan">${data.name}</span> \n\n ${data.desc} \n\n`
    }
})

JDA.register('param', {
    temp: ['type', 'name', 'desc'],
    output: function(data) {
        return `<span style="color:lightblue">@param</span> : <span style="padding:3px 6px; display:inline-block; color:#8c83af">${data.type.slice(1, -1)}</span> <font color="#e30090">${data.name}</font> ${data.desc}\n\n`
    }
})

JDA.register('default', {
    temp: ['value'],
    output: function(data) {
        return `<span style="color:pink">default</span> : ${data.value}\n\n`
    }
})

JDA.register('see', {
    temp: ['name', 'url'],
    output: function(data) {
        return `<span style="color : yellow">link</span> : [${data.name}](${data.url})\n\n`
    }
})

JDA.register('desc', {
    temp: ['text'],
    output: function(data) {
        return "<span style='width:100%; display:inline-block;'>" + data.text + '</span>\n\n'
    }
})

JDA.register('callback', {
    temp: ['param'],
    output: function(data) {
        return '<span style="color:wheat" >callback</span> : <code>' + data.param + '=> { do something... }</code>'
    }
})

JDA.register('returns', {
    temp: ['data'],
    output: function(data) {
        return `<span style="color:pink">return</span> : ${data.data}\n\n`
    }
})
