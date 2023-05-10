import fetch from 'node-fetch'

export async function CompileCode(req, res, next) {

    var code = req.body.code

    const program = {
        script: code,
        language: "python3",
        versionIndex: "4",
        clientId: "26a0fa26959b444c769e829e62bb4b10",
        clientSecret: "cde26308ed67991743c4fefedc06867df45eae3a5aa7fe41d6edad57b4acd824"
    };

    const body = `{
        "script": "${program.script.replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\t/g, '\\t')}",
        "language": "${program.language}",
        "versionIndex": "${program.versionIndex}",
        "clientId": "${program.clientId}",
        "clientSecret": "${program.clientSecret}"
    }`;

    fetch('https://api.jdoodle.com/v1/execute', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: body
    })
        .then(response => response.json())
        .then(data => {
            res.json({
                data
            })
            console.log(program.script.replace(/"/g, '\\"').replace(/\n/g, '\\n').replace("   ", '\\t'))
        })
        .catch(error => {
            res.json({
                error
            })
        });
}