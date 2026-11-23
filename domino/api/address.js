// Server-side proxy: the JUSO approval key must never be sent to the browser.
module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const keyword = typeof req.query.keyword === 'string' ? req.query.keyword.trim() : '';
  const page = Math.max(1, Math.min(100, Number.parseInt(req.query.page, 10) || 1));
  if (keyword.length < 2 || keyword.length > 100) return res.status(400).json({ error: '검색어를 2자 이상 입력해 주세요.' });
  const key = process.env.JUSO_API_KEY;
  if (!key) return res.status(503).json({ error: '주소 검색 서비스를 사용할 수 없습니다.' });
  try {
    const params = new URLSearchParams({ confmKey: key, currentPage: String(page), countPerPage: '5', keyword, resultType: 'json' });
    const response = await fetch('https://business.juso.go.kr/addrlink/addrLinkApi.do?' + params.toString(), { signal: AbortSignal.timeout(9000) });
    if (!response.ok) throw new Error('JUSO upstream HTTP ' + response.status);
    const payload = await response.json();
    const common = payload?.results?.common || {};
    if (String(common.errorCode || '0') !== '0') throw new Error('JUSO upstream error ' + common.errorCode);
    const list = Array.isArray(payload?.results?.juso) ? payload.results.juso : [];
    return res.status(200).json({
      total: Math.max(0, Number(common.totalCount) || 0),
      page,
      addresses: list.map(x => ({ road: String(x.roadAddr || ''), jibun: String(x.jibunAddr || ''), zip: String(x.zipNo || '') }))
    });
  } catch (error) {
    console.error('JUSO search failed:', error.message);
    return res.status(502).json({ error: '주소 검색 중 오류가 발생했습니다. 잠시 후 다시 검색해 주세요.' });
  }
};
