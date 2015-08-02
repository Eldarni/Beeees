<?php

//prep the array with the mundane bee types (ones that have to be gotten via non breeding means)
$bees = array(
    'extrabees.species.basalt'    => array('type' => 'extrabees.species.basalt',    'name' => 'Embittered', 'breeding' => null, 'sprite' => 'bee-embittered', 'notes' => null),
    'extrabees.species.rock'      => array('type' => 'extrabees.species.rock',      'name' => 'Rocky',      'breeding' => null, 'sprite' => 'bee-rocky',      'notes' => null),
    'extrabees.species.water'     => array('type' => 'extrabees.species.water',     'name' => 'Watery',     'breeding' => null, 'sprite' => 'bee-watery',     'notes' => null),
    'forestry.speciesEnded'       => array('type' => 'forestry.speciesEnded',       'name' => 'Ender',      'breeding' => null, 'sprite' => 'bee-ender',      'notes' => null),
    'forestry.speciesForest'      => array('type' => 'forestry.speciesForest',      'name' => 'Forest',     'breeding' => null, 'sprite' => 'bee-forest',     'notes' => null),
    'forestry.speciesMarshy'      => array('type' => 'forestry.speciesMarshy',      'name' => 'Marshy',     'breeding' => null, 'sprite' => 'bee-marshy',     'notes' => null),
    'forestry.speciesMeadows'     => array('type' => 'forestry.speciesMeadows',     'name' => 'Meadows',    'breeding' => null, 'sprite' => 'bee-meadows',    'notes' => null),
    'forestry.speciesModest'      => array('type' => 'forestry.speciesModest',      'name' => 'Modest',     'breeding' => null, 'sprite' => 'bee-modest',     'notes' => null),
    'forestry.speciesMonastic'    => array('type' => 'forestry.speciesMonastic',    'name' => 'Monastic',   'breeding' => null, 'sprite' => 'bee-monastic',   'notes' => null),
    'forestry.speciesSteadfast'   => array('type' => 'forestry.speciesSteadfast',   'name' => 'Steadfast',  'breeding' => null, 'sprite' => 'bee-steadfast',  'notes' => null),
    'forestry.speciesTropical'    => array('type' => 'forestry.speciesTropical',    'name' => 'Tropical',   'breeding' => null, 'sprite' => 'bee-tropical',   'notes' => null),
    'forestry.speciesValiant'     => array('type' => 'forestry.speciesValiant',     'name' => 'Valiant',    'breeding' => null, 'sprite' => 'bee-valiant',    'notes' => null),
    'forestry.speciesWintry'      => array('type' => 'forestry.speciesWintry',      'name' => 'Wintry',     'breeding' => null, 'sprite' => 'bee-wintry',     'notes' => null),
    'magicbees.speciesAttuned'    => array('type' => 'magicbees.speciesAttuned',    'name' => 'Attuned',    'breeding' => null, 'sprite' => 'bee-attuned',    'notes' => null),
    'magicbees.speciesBotBotanic' => array('type' => 'magicbees.speciesBotBotanic', 'name' => 'Botanic',    'breeding' => null, 'sprite' => 'bee-botanic',    'notes' => null),
    'magicbees.speciesInfernal'   => array('type' => 'magicbees.speciesInfernal',   'name' => 'Infernal',   'breeding' => null, 'sprite' => 'bee-infernal',   'notes' => null),
    'magicbees.speciesMystical'   => array('type' => 'magicbees.speciesMystical',   'name' => 'Mystical',   'breeding' => null, 'sprite' => 'bee-mystical',   'notes' => null),
    'magicbees.speciesOblivion'   => array('type' => 'magicbees.speciesOblivion',   'name' => 'Oblivian',   'breeding' => null, 'sprite' => 'bee-oblivian',   'notes' => null),
    'magicbees.speciesSorcerous'  => array('type' => 'magicbees.speciesSorcerous',  'name' => 'Sorcerous',  'breeding' => null, 'sprite' => 'bee-sorcerous',  'notes' => null),
    'magicbees.speciesUnusual'    => array('type' => 'magicbees.speciesUnusual',    'name' => 'Unusual',    'breeding' => null, 'sprite' => 'bee-unusual',    'notes' => null),
);

//pull in the list of bee mutations, use this to finish the index and breeding data
$mutations = array_map('str_getcsv', file('./bee_mutation.csv'));
unset($mutations[0]);

foreach ($mutations as $mutation) {

    //add the bee information to the bee index
    if (!isset($bees[$mutation[0]])) {
        $bees[$mutation[0]] = array('type' => $mutation[0], 'name' => $mutation[1], 'breeding' => null, 'sprite' => 'bee-' . str_replace(' ', '-', strtolower($mutation[1])), 'notes' => null);
    }

    //compile the bee parentage data
    $bees[$mutation[0]]['breeding'][] = array('allele1' => $mutation[2], 'allele2' => $mutation[3], 'chance' => $mutation[4], 'conditions' => $mutation[5]);
}

echo json_encode(array_values($bees));
//print_r($bee_index);

