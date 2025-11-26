// 전문 용어 사전
export const glossary = {
    'UBI': 'Universal Basic Income (보편적 기본소득): 모든 사람에게 무조건적으로 지급되는 기본소득',
    'DID': 'Decentralized Identifier (분산 신원): 중앙 기관 없이 개인이 직접 관리하는 디지털 신원',
    'Personhood': '인격: 한 사람의 고유한 정체성과 존엄성',
    'Personhood Standard': '인격본위제: 화폐의 가치를 사람의 존재 자체에 연동하는 시스템',
    'QE': 'Quantitative Easing (양적 완화): 중앙은행이 시중에 통화를 공급하는 정책',
    'DAO': 'Decentralized Autonomous Organization (분산 자율 조직): 스마트 계약으로 운영되는 조직',
    'KYC': 'Know Your Customer (고객 신원 확인): 금융 기관이 고객의 신원을 확인하는 절차',
    'Sybil': '시빌 공격: 한 사람이 여러 개의 가짜 계정을 만들어 시스템을 조작하는 공격',
    'MVP': 'Minimum Viable Product (최소 기능 제품): 핵심 기능만 구현한 초기 버전 제품',
    'NFT': 'Non-Fungible Token (대체 불가능 토큰): 고유한 디지털 자산을 나타내는 토큰',
    'P2P': 'Peer-to-Peer (개인 간): 중개자 없이 개인 간 직접 거래하는 방식',
    'VC': 'Venture Capital (벤처 캐피탈): 스타트업에 투자하는 투자 회사',
    '인격본위제': '화폐의 가치를 금이나 국가가 아닌 사람의 존재와 데이터에 연동하는 시스템',
    '데이터본위제': '개인의 데이터를 화폐 가치의 기반으로 삼는 경제 시스템',
    '시빌 저항': '한 사람이 여러 계정을 만드는 것을 방지하는 메커니즘',
    '협동조합': '조합원들이 공동으로 소유하고 민주적으로 운영하는 조직',
};

// 용어를 찾아서 툴팁을 추가하는 함수
export const wrapTermsWithTooltip = (text) => {
    if (typeof text !== 'string') return text;

    let result = text;
    const terms = Object.keys(glossary).sort((a, b) => b.length - a.length); // 긴 용어부터 처리

    terms.forEach(term => {
        const regex = new RegExp(`\\b${term}\\b`, 'g');
        result = result.replace(regex, `<abbr class="term-tooltip" title="${glossary[term]}">${term}</abbr>`);
    });

    return result;
};
