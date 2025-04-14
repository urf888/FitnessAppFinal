// data/ingredientVariations.jsx
// Bază de date de variații pentru ingrediente comune

export const ingredientVariationsMap = {
    // Carne și pește
    'vită': ['carne de vită', 'carne tocată slabă de vită', 'carne tocată de vită', 'mușchi de vită', 'antricot', 'rasol', 'pulpă de vită', 'carne vită'],
    'vita': ['carne de vită', 'carne tocată de vită', 'carne tocată slabă de vită', 'mușchi de vită', 'antricot', 'carne vită'],
    'pui': ['piept de pui', 'pulpe de pui', 'aripioare de pui', 'carne de pui', 'ficăței de pui', 'carne tocată de pui'],
    'porc': ['carne de porc', 'cotlet', 'mușchi de porc', 'ceafă de porc', 'carne tocată de porc'],
    'pește': ['file de pește', 'ton', 'somon', 'păstrăv', 'cod', 'merluciu'],
    'peste': ['file de pește', 'ton', 'somon', 'păstrăv', 'cod', 'merluciu'],
    'ton': ['ton în ulei', 'ton în apă', 'file de ton'],
    'somon': ['file de somon', 'somon afumat'],
    
    // Legume
    'roșii': ['roșii cherry', 'roșii uscate', 'pastă de roșii', 'bulion', 'suc de roșii', 'roșii coapte'],
    'rosii': ['roșii cherry', 'roșii uscate', 'pastă de roșii', 'bulion', 'suc de roșii', 'roșii coapte'],
    'ceapă': ['ceapă roșie', 'ceapă verde', 'ceapă albă', 'arpagic', 'șalotă', 'praz'],
    'ceapa': ['ceapă roșie', 'ceapă verde', 'ceapă albă', 'arpagic', 'șalotă', 'praz'],
    'cartofi': ['cartofi dulci', 'cartofi noi', 'cartofi albi', 'piure de cartofi', 'cartofi roșii'],
    'ardei': ['ardei gras', 'ardei kapia', 'ardei iute', 'ardei roșu', 'ardei verde', 'ardei gălbui'],
    'morcovi': ['morcov', 'baby morcovi'],
    'usturoi': ['usturoi zdrobit', 'usturoi pisat', 'căței de usturoi'],
    'ciuperci': ['ciuperci champignon', 'ciuperci pleurotus', 'ciuperci shiitake', 'hribi'],
    
    // Produse lactate
    'brânză': ['brânză feta', 'brânză de capră', 'mozzarella', 'parmezan', 'cașcaval', 'telemea'],
    'branza': ['brânză feta', 'brânză de capră', 'mozzarella', 'parmezan', 'cașcaval', 'telemea'],
    'lapte': ['lapte de vacă', 'lapte de capră', 'lapte de migdale', 'lapte de soia', 'lapte de cocos'],
    'iaurt': ['iaurt grecesc', 'iaurt natural', 'iaurt de casă'],
    
    // Cereale și paste
    'orez': ['orez brun', 'orez basmati', 'orez sălbatic', 'orez pentru sushi', 'orez cu bob rotund'],
    'paste': ['spaghete', 'penne', 'fusilli', 'farfalle', 'tagliatelle', 'macaroane'],
    
    // Leguminoase
    'fasole': ['fasole boabe', 'fasole verde', 'fasole albă', 'fasole roșie', 'fasole neagră'],
    'năut': ['năut din conservă', 'hummus', 'făină de năut'],
    'naut': ['năut din conservă', 'hummus', 'făină de năut'],
    'linte': ['linte roșie', 'linte verde', 'linte neagră'],
    
    // Nuci și semințe
    'nuci': ['nuci pecan', 'miez de nucă', 'nuci caju', 'nuci de pin', 'fistic'],
    'migdale': ['migdale prăjite', 'fulgi de migdale', 'făină de migdale', 'lapte de migdale'],
    'semințe de floarea-soarelui': ['semințe de floarea soarelui', 'miez de floarea-soarelui'],
    'semințe de dovleac': ['seminte de dovleac', 'miez de dovleac'],
    
    // Fructe
    'mere': ['măr', 'mere verzi', 'mere roșii', 'suc de mere'],
    'banană': ['banane', 'piure de banană'],
    'banana': ['banane', 'piure de banană'],
    'lămâie': ['zeamă de lămâie', 'suc de lămâie', 'coajă de lămâie'],
    'lamaie': ['zeamă de lămâie', 'suc de lămâie', 'coajă de lămâie'],
    
    // Condimente
    'busuioc': ['busuioc proaspăt', 'busuioc uscat'],
    'oregano': ['oregano uscat', 'oregano proaspăt'],
    'cimbru': ['cimbru uscat', 'cimbru proaspăt'],
    'rozmarin': ['rozmarin uscat', 'rozmarin proaspăt'],
    'pătrunjel': ['pătrunjel verde', 'pătrunjel proaspăt'],
    'patrunjel': ['pătrunjel verde', 'pătrunjel proaspăt'],
    
    // Uleiuri și grăsimi
    'ulei': ['ulei de măsline', 'ulei de floarea-soarelui', 'ulei de cocos', 'ulei de rapiță'],
    'unt': ['unt de arahide', 'unt clarificat', 'ghee'],
  };
  
  // Funcție pentru a obține toate variațiile pentru un ingredient
  export const getIngredientVariations = (ingredient) => {
    const lowerIngredient = ingredient.toLowerCase().trim();
    
    // Verificăm dacă avem variații predefinite pentru acest ingredient
    if (lowerIngredient in ingredientVariationsMap) {
      // Returnăm ingredientul original și toate variațiile sale
      return [lowerIngredient, ...ingredientVariationsMap[lowerIngredient]];
    }
    
    // Pentru alte ingrediente, returnăm doar ingredientul original
    return [lowerIngredient];
  };
  
  // Funcție pentru a verifica dacă un ingredient se potrivește cu un text
  export const ingredientMatches = (ingredientText, searchIngredient) => {
    const lowerIngredientText = ingredientText.toLowerCase();
    const lowerSearchIngredient = searchIngredient.toLowerCase().trim();
    
    // Verificăm dacă textul ingredientului conține ingredientul căutat
    if (lowerIngredientText.includes(lowerSearchIngredient)) {
      return true;
    }
    
    // Obținem variațiile pentru ingredientul căutat
    const variations = getIngredientVariations(lowerSearchIngredient);
    
    // Verificăm dacă textul ingredientului conține vreuna din variații
    for (const variation of variations) {
      if (lowerIngredientText.includes(variation)) {
        return true;
      }
    }
    
    return false;
  };