const cnpjs = [
  '33000167000101', // Petrobras
  '00000000000191', // Banco do Brasil
  '60701190000104', // Itaú Unibanco
  '60746948000112', // Bradesco
  '27865757000102', // Vale
  '02808708000197', // Ambev
  '07689002000189', // Embraer
  '00001180000126', // Eletrobras
  '34028316000103', // Correios
  '33592510000154', // Magazine Luiza
  '47960950000121', // Via Varejo
  '59291534000107', // Lojas Americanas
  '45543915000181', // Carrefour
  '47508411000156', // Grupo Pão de Açúcar
  '33014556000196', // BRF
  '17184037000147', // JBS
  '01838723000127', // Natura
  '92665611000119', // Localiza
  '89086144000135', // Raízen
  '50746577000115', // Telefônica Brasil (Vivo)
  '02558157000162', // TIM
  '33530486000176', // Oi
  '04206050000115', // Santander Brasil
  '92702067000196', // Caixa Econômica Federal
  '33349358000101', // Banco Safra
  '00517645000116', // BTG Pactual
  '02916265000145', // Banco Inter
  '09168704000142', // Nubank
  '28127603000178', // Cielo
  '01027058000191', // Rede
  '07237373000120', // PagSeguro
  '18236120000158', // Stone
  '00000000000272', // Copel
  '17343868000187', // CPFL Energia
  '04895009000184', // Cemig
  '02998611000104', // Energisa
  '60500139000138', // Gerdau
  '50318944000139', // Usiminas
  '61156113000106', // CSN
  '21413992000141', // Suzano
  '92791243000170', // Klabin
  '04967901000130', // Braskem
  '33530486000176', // Ultrapar
  '61186888000104', // Cosan
  '02155552000151', // Rumo
  '02184841000199', // CCR
  '04149454000176', // Ecorodovias
  '89086144000135', // Vibra Energia
  '07526557000110', // 3R Petroleum
  '28665919000124', // Hypera Pharma
];

const BASE_URL = 'https://cnpjconsulta.app/cnpj';
const DELAY_MS = 2000;

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchCNPJ(cnpj, index, total) {
  const url = `${BASE_URL}/${cnpj}`;

  try {
    console.log(`[${index + 1}/${total}] Acessando ${cnpj}...`);
    const response = await fetch(url);

    if (response.ok) {
      console.log(`[${index + 1}/${total}] ✓ ${cnpj} - Status: ${response.status}`);
    } else {
      console.log(`[${index + 1}/${total}] ✗ ${cnpj} - Status: ${response.status}`);
    }
  } catch (error) {
    console.log(`[${index + 1}/${total}] ✗ ${cnpj} - Erro: ${error.message}`);
  }
}

async function run() {
  console.log(`Iniciando crawler para ${cnpjs.length} CNPJs...\n`);

  for (let i = 0; i < cnpjs.length; i++) {
    await fetchCNPJ(cnpjs[i], i, cnpjs.length);

    if (i < cnpjs.length - 1) {
      await sleep(DELAY_MS);
    }
  }

  console.log(`\nCrawler finalizado!`);
}

run();
