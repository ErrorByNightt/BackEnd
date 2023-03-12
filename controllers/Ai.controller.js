import { spawn } from 'child_process';
import UCQModel from '../Models/UCQ.model.js';

export async function getQCM(req, res, next) {
    runPythonScript('AI.py', req, res, next)
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
            var startIndex = text.indexOf("A)");
            var part1 = text.substring(0, startIndex).trim();

            var optionA = text.substring(startIndex, text.indexOf("B)")).trim();
            var optionB = text.substring(text.indexOf("B)"), text.indexOf("C)")).trim();
            var optionC = text.substring(text.indexOf("C)"), text.indexOf("D)")).trim();
            var optionD = text.substring(text.indexOf("D)"), text.indexOf("Correct Answer :")).trim();

            var part2 = text.substring(text.lastIndexOf("Correct Answer :")).trim();

            res.status(201).json({
                question: part1,
                answer1: optionA,
                answer2: optionB,
                answer3: optionC,
                answer4: optionD,
                correctAnswer: part2
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


export async function saveUCQ(req, res, next) {
    let ucq = new UCQModel({
        question: req.body.question,
        answer1: req.body.answer1,
        answer2: req.body.answer2,
        answer3: req.body.answer3,
        answer4: req.body.answer4,
        correctAnswer: req.body.correctAnswer
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

export async function generateUCQ(req, res, next) {
    UCQModel.aggregate([{ $sample: { size: 1 } }])
        .then(doc => {
            res.status(200).json(doc);
        })
        .catch(err => {
            console.error(err);
        });
}

export async function solveUCQ(req, res, next) {
    const { userAttempt, id } = req.body;
    try {
        let ucq = await UCQModel.findById(id); // find the document by ID
        if (!ucq) {
            return res.status(404).json({ message: 'UCQ not found' });
        }
        if (ucq.correctAnswer === userAttempt) { // compare the userAttempt with the correctAnswer field
            return res.status(200).json({ message: 'Your attempt is correct!' });
        } else {
            return res.status(403).json({ message: 'Your attempt is incorrect!' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

//HINT

export async function getHINT(req, res, next) {
    runPythonScript2('hint.py', req, res, next)
        .then(() => {

        })
        .catch((error) => {
            console.error(`Python script failed: ${error.message}`);
        });
}

function runPythonScript2(scriptPath, req, res, next) {

    let question = req.body.question

    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', [scriptPath, question]);
        

        pythonProcess.stdout.on('data', (data) => {
            const hint = data.toString('utf8').trim();
            res.status(201).json({
                hint
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