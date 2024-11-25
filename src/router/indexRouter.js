import express from 'express';
import fs from 'fs';

const router = express.Router();
const filePath = './data.json';

router.get('/numberPressed/:num', (req, res) => {
  const num = parseInt(req.params.num);
  if (isNaN(num)) {
    return res.status(400).send('Invalid number');
  }
    res.sendStatus(200);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(500).send('Internal server error');
    }

    let jsonData;
    try {
      jsonData = JSON.parse(data);
    } catch (parseErr) {
      console.error('Error parsing JSON:', parseErr);
      return res.status(500).send('Internal server error');
    }

    if (num >= 0 && num <= 9) {
      jsonData.buttons[num]++;
      console.log('Button', num, 'pressed', jsonData.buttons[num], 'times');

      fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (writeErr) => {
        if (writeErr) {
          console.error('Error writing file:', writeErr);
          return res.status(500).send('Internal server error');
        }
        console.log('JSON data updated successfully');
      });
    }
  });
});

router.get('/getNumbers', (req, res) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Internal server error');
        }

        let jsonData;
        try {
            jsonData = JSON.parse(data);
        } catch (parseErr) {
            console.error('Error parsing JSON:', parseErr);
            return res.status(500).send('Internal server error');
        }

        res.json(jsonData.buttons);
    });
});
export default router;