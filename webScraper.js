const axios = require('axios');
const cheerio = require('cheerio');

const sitesImoveis = [
  'https://www.zapimoveis.com.br/',
  'https://www.vivareal.com.br/',
  'https://www.imovelweb.com.br/',
  'https://www.chavesnamao.com.br/',
  'https://www.olx.com.br/imoveis/',
  'https://www.quintoandar.com.br/',
  'https://www.movingimoveis.com.br/',
  'https://www.mercadolivre.com.br/imoveis',
  'https://www.storiaimoveis.com.br/',
  'https://www.casamineira.com.br/',
  'https://www.tecnisa.com.br/',
  'https://www.mrv.com.br/',
  'https://www.lugarcerto.com.br/',
  'https://www.larbrasil.com.br/',
  'https://www.imovelavenda.com.br/',
  'https://www.imooveis.com/',
  'https://www.newcore.net.br/',
  'https://www.imovelguido.com.br/',
  'https://www.imobiliariaportal.com.br/',
  'https://www.imobibrasil.com.br/'

];

async function crawlSitePages(siteUrl) {
  const allPages = new Set();
  const visitedPages = new Set();
  const queue = [siteUrl];

  while (queue.length > 0) {
    const currentUrl = queue.shift();

    if (!visitedPages.has(currentUrl)) {
      visitedPages.add(currentUrl);

      try {
        console.log(`Tentando buscar links em: ${currentUrl}`);
        const response = await axios.get(currentUrl);
        const $ = cheerio.load(response.data);

        $('a, p, span').each((index, element) => {
          const href = $(element).attr('href');
          if (href && href.startsWith(siteUrl)) {
            const newUrl = href.split('#')[0];
            if (!visitedPages.has(newUrl)) {
              queue.push(newUrl);
            }
          }

          const text = $(element).text().trim();
          const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
          const foundEmails = text.match(emailRegex);
          if (foundEmails) {
            foundEmails.forEach(email => {
              console.log(`Email encontrado em ${currentUrl}: ${email}`);
              // Aqui seria o local para salvar o email no MongoDB usando o modelo Email
              // Exemplo: new Email({ email }).save();
            });
          }
        });

        allPages.add(currentUrl);
      } catch (error) {
        console.error(`Erro ao buscar links em ${currentUrl}:`, error);
      }
    }
  }

  return Array.from(allPages);
}

async function crawlAllSites() {
  for (const site of sitesImoveis) {
    try {
      const pages = await crawlSitePages(site);
      console.log(`Páginas encontradas em ${site}:`, pages);
      // Aqui você pode fazer o que quiser com as páginas encontradas em cada site
    } catch (error) {
      console.error(`Erro ao rastrear páginas em ${site}:`, error);
    }
  }
}

crawlAllSites();
