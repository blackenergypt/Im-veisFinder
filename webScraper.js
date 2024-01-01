const axios = require('axios');
const cheerio = require('cheerio');

const sitesImoveis = [
  'https://www.imovirtual.com/',
  'https://www.idealista.pt/',
  'https://casa.sapo.pt/',
  'https://www.luximos.pt/',
  'https://www.remax.pt/',
  'https://www.century21.pt/',
  'https://www.era.pt/',
  'https://www.ideal-casa.com/',
  'https://www.predialrainhasanta.pt/',
  'https://www.iadportugal.pt/',
  'https://www.nolon.pt/',
  'https://www.easygest.com.pt/',
  'https://www.pplaceliving.com/',
  'https://www.mercadodascasas.com/',
  'https://habitop.pt/',
  'https://www.century21invest.pt/',
  'https://www.insideliving.pt/',
  'https://www.qualidadedeespacos.com/',
  'https://www.luximmo.pt/',
  'https://www.areanobre.pt/',
  'https://www.urbiparede.pt/',
  'https://www.miropole.com/',
  'https://www.globalplataform.pt/',
  'https://www.qualityliving.pt/',
  'https://tangerinagomes.pt/',
  'https://www.novodia.pt/',
  'https://www.exata.pt/',
  'https://www.zillow.com/',
  'https://www.realtor.com/',
  'https://www.trulia.com/',
  'https://www.redfin.com/',
  'https://www.homes.com/',
  'https://www.movoto.com/',
  'https://www.estately.com/',
  'https://www.coldwellbankerhomes.com/',
  'https://www.berkshirehathawayhs.com/',
  'https://www.compass.com/',
  'https://www.sothebysrealty.com/',
  'https://www.weichert.com/',
  'https://www.kw.com/',
  'https://www.c21.com/',
  'https://www.longandfoster.com/',
  'https://www.forsalebyowner.com/',
  'https://www.homefinder.com/',
  'https://www.eppraisal.com/',
  'https://www.realtytrac.com/',
  'https://www.har.com/',
  'https://www.fotocasa.es/',
  'https://www.pisos.com/',
  'https://www.kyero.com/',
  'https://www.yaencontre.com/',
  'https://www.habitaclia.com/',
  'https://www.spainhouses.net/',
  'https://www.immobiliariasmadrid.com/',
  'https://www.immobiliaria.net/',
  'https://www.solvia.es/',
  'https://www.metroscubicos.com/',
  'https://www.hogaria.net/',
  'https://www.ventadepisos.com/',
  'https://www.casasynovas.com/',
  'https://www.ensancheinmobiliaria.com/',
  'https://www.inmoglaciar.com/',
  'https://www.yaencontre.com/',
  'https://www.vivalia-habitat.com/',


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
