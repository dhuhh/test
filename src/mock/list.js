
const dataSource = [
  {
    key: '1',
    seqno: 1,
    evaluation_dimension: '产品种类及投资风格',
    weights: '30%',
    evaluation_index: '不适用',
    evaluation_index_val: '不适用',
    score_way: ['非常适合:100', '十分适合:80', '较为合适:60', '基本合适:40', '不太合适:20', '不合适:0'],
    scores: 90,
  },
  {
    key: '2',
    seqno: 2,
    evaluation_dimension: '产品种类及投资风格',
    weights: '30%',
    evaluation_index: '不适用',
    evaluation_index_val: '不适用',
    score_way: ['非常适合:100', '十分适合:80', '较为合适:60', '基本合适:40', '不太合适:20', '不合适:0'],
    scores: 70,
  },
  {
    key: '3',
    seqno: 3,
    evaluation_dimension: '产品种类及投资风格',
    weights: '20%',
    evaluation_index: '不适用',
    evaluation_index_val: '不适用',
    score_way: ['非常适合:100', '十分适合:80', '较为合适:60', '基本合适:40', '不太合适:20', '不合适:0'],
    scores: 95,
  },
  {
    key: '4',
    seqno: 4,
    evaluation_dimension: '产品种类及投资风格',
    weights: '20%',
    evaluation_index: '不适用',
    evaluation_index_val: '不适用',
    score_way: ['非常适合:100', '十分适合:80', '较为合适:60', '基本合适:40', '不太合适:20', '不合适:0'],
    scores: 87,
  },
];

module.exports = {
  'GET /request/templatelist': (req, resp) => {
    console.log(req.query);
    resp.status(200).json(dataSource);
  },
};
