import { spawn } from 'child_process';



export async function getProblem(req, res, next) {
    runPythonScript('test.py', req, res, next)
        .then(() => {

        })
        .catch((error) => {
            console.error(`Python script failed: ${error.message}`);
        });
}



function runPythonScript(scriptPath, req, res, next) {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', [scriptPath]);

        pythonProcess.stdout.on('data', (data) => {
            const text = data.toString('utf8');
            var startIndex = text.indexOf("Solution :");
            var problem = text.substring(0, startIndex-1).trim();
            var solution = text.substring(startIndex, text.indexOf("Output :")-1).trim();
            var output = text.substring(text.lastIndexOf("Output :")).trim();
            let cleanedProblem = problem.replace(/\r\n\r\n/g, ' ');
            let cleanedSolution = solution.replace(/\r\n\r\n/g, ' ');
            let cleanedOutput = output.replace(/\r\n\r\n/g, ' ');

            res.status(201).json({
                problem: cleanedProblem,
                solution: cleanedSolution,
                output: cleanedOutput,
            })

        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        pythonProcess.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Python script exited with code ${code}`));
            }
        });
    });
}

export async function saveProblem(req, res, next) {
    let prob = new codeModel({
        problem: req.body.problem,
        input: req.body.input,
        output: req.body.output,
        solution: req.body.solution
    })

    ucq
        .save()
        .then(ucq => {
            res.status(200).json(ucq)
        })
        .catch(err => {
            res.json({
                error: err
            })
        })
}


export async function generateProb(req, res, next) {
    codeModel.aggregate([{ $sample: { size: 1 } }])
        .then(doc => {
            res.status(200).json(doc);
        })
        .catch(err => {
            console.error(err);
        });
}


export async function codeProblem(req, res, next) {
    const { userAttempt, id } = req.body;
    try {
        let prob = await codeModel.findById(id); // find the document by ID
        if (!prob) {
            return res.status(404).json({ message: 'problem not found' });
        }
        if (prob.solution === userAttempt) { // compare the userAttempt with the correctAnswer field
            return res.json({ message: 'Your solution is correct!' });
        } else {
            return res.json({ message: 'Your solution is incorrect!' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}