<?php

namespace Database\Seeders;

use App\Models\Translation;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TranslationsSeeder extends Seeder
{
    /**
     * Ejecuta los seeders.
     */
    public function run(): void
    {
        $translations = [
            // Libros
            ['key' => 'book_title juego_de_tronos', 'language' => 'es', 'translation' => 'Juego de Tronos'],
            ['key' => 'book_title juego_de_tronos', 'language' => 'en', 'translation' => 'Game of Thrones'],
            ['key' => 'book_desc juego_de_tronos', 'language' => 'es', 'translation' => 'Canción de hielo y fuego: Libro primero La novela río más espectacular jamás escrita Tras el largo verano, el invierno se acerca a los Siete Reinos. Lord Eddard Stark, señor de Invernalia, deja sus dominios para unirse a la corte de su amigo el rey Robert Baratheon, llamado el Usurpador, hombre díscolo y otrora guerrero audaz cuyas mayores aficiones son comer, beber y engendrar bastardos. Eddard Stark ocupará el cargo de Mano del Rey e intentará desentrañar una maraña de intrigas que pondrá en peligro su vida y la de todos los suyos. En un mundo cuyas estaciones pueden durar decenios y en el que retazos de una magia inmemorial y olvidada surgen en los rincones más sombríos y maravillosos, la traición y la lealtad, la compasión y la sed de venganza, el amor y el poder hacen del juego de tronos una poderosa trampa que atrapará en sus fauces a los personajes... y al lector.'],
            ['key' => 'book_desc juego_de_tronos', 'language' => 'en', 'translation' => 'A Game of Thrones is the first novel in A Song of Ice and Fire, a series of fantasy novels by the American author George R. R. Martin. It was first published on August 6, 1996. The novel won the 1997 Locus Award and was nominated for both the 1997 Nebula Award and the 1997 World Fantasy Award. The novella Blood of the Dragon, comprising the Daenerys Targaryen chapters from the novel, won the 1997 Hugo Award for Best Novella.'],

            ['key' => 'book_title choque_de_reyes', 'language' => 'es', 'translation' => 'Choque de Reyes'],
            ['key' => 'book_title choque_de_reyes', 'language' => 'en', 'translation' => 'Clash of Kings'],
            ['key' => 'book_desc choque_de_reyes', 'language' => 'es', 'translation' => 'Choque de reyes es el segundo libro de la saga de fantasía épica Canción de hielo y fuego, escrita por George R. R. Martin. Fue publicado por primera vez en 1998. La novela ganó el premio Locus en 1999 y fue nominada para los premios Nebula y Mundial de Fantasía en 1998.'],
            ['key' => 'book_desc choque_de_reyes', 'language' => 'en', 'translation' => 'A Clash of Kings is the second novel in A Song of Ice and Fire, a series of fantasy novels by the American author George R. R. Martin. It was first published on February 16, 1999. The novel won the 1999 Locus Award and was nominated for both the 1998 Nebula Award and the 1999 World Fantasy Award.'],

            ['key' => 'book_title harry_potter_y_la_piedra_filosofal', 'language' => 'es', 'translation' => 'Harry Potter y la Piedra Filosofal'],
            ['key' => 'book_title harry_potter_y_la_piedra_filosofal', 'language' => 'en', 'translation' => 'Harry Potter and the Philosopher\'s Stone'],
            ['key' => 'book_desc harry_potter_y_la_piedra_filosofal', 'language' => 'es', 'translation' => 'Harry Potter nunca ha oído hablar de Hogwarts hasta que empiezan a caer cartas en el felpudo del número 4 de Privet Drive. Llevan la dirección escrita con tinta verde en un sobre de pergamino amarillento con un sello de lacre púrpura, y sus horripilantes tíos se apresuran a confiscarlas. Más tarde, el día que Harry cumple once años, Rubeus Hagrid, un hombre gigantesco cuyos ojos brillan como escarabajos negros, irrumpe con una noticia extraordinaria: Harry Potter es un mago, y le han concedido una plaza en el Colegio Hogwarts de Magia y Hechicería. ¡Está a punto de comenzar una aventura increíble!'],
            ['key' => 'book_desc harry_potter_y_la_piedra_filosofal', 'language' => 'en', 'translation' => 'Harry Potter has never even heard of Hogwarts when the letters start dropping on the doormat at number four, Privet Drive. Addressed in green ink on yellowish parchment with a purple seal, they are swiftly confiscated by his grisly aunt and uncle. Then, on Harry\'s eleventh birthday, a great beetle-eyed giant of a man called Rubeus Hagrid bursts in with some astonishing news: Harry Potter is a wizard, and he has a place at Hogwarts School of Witchcraft and Wizardry. An incredible adventure is about to begin! \n J.K. Rowling\'s internationally bestselling Harry Potter books continue to captivate new generations of readers. Harry\'s first adventure alongside his friends, Ron and Hermione, will whisk you away to Hogwarts, an enchanted, turreted castle filled with disappearing staircases, pearly-white ghosts and magical paintings that flit from frame to frame. This gorgeous hardback edition features a spectacular cover by award-winning artist Jonny Duddle, as well as refreshed bonus material including fun facts exploring the origins of names such as Albus Dumbledore, Hedwig and other favourite characters.'],

            ['key' => 'book_title harry_potter_y_la_camara_secreta', 'language' => 'es', 'translation' => 'Harry Potter y la Cámara Secreta'],
            ['key' => 'book_title harry_potter_y_la_camara_secreta', 'language' => 'en', 'translation' => 'Harry Potter and the Chamber of Secrets'],
            ['key' => 'book_desc harry_potter_y_la_camara_secreta', 'language' => 'es', 'translation' => 'El verano de Harry Potter ha incluido el peor cumpleaños de su vida, las funestas advertencias de un elfo doméstico llamado Dobby y el rescate de casa de los Dursley protagonizado por su amigo Ron Weasley al volante de un coche mágico volador. De vuelta en el Colegio Hogwarts de Magia y Hechicería, donde va a empezar su segundo curso, Harry oye unos extraños susurros que resuenan por los pasillos vacíos. Y entonces empiezan los ataques y varios alumnos aparecen petrificados... Por lo visto, las siniestras predicciones de Dobby se están cumpliendo....'],
            ['key' => 'book_desc harry_potter_y_la_camara_secreta', 'language' => 'en', 'translation' => 'Harry Potter\'s summer has included the worst birthday ever, doomy warnings from a house-elf called Dobby and rescue from the Dursleys by his friend Ron Weasley in a magical flying car! Back at Hogwarts School of Witchcraft and Wizardry for his second year, Harry hears strange whispers echo through empty corridors - and then the attacks start. Students are found as though turned to stone . Dobby\'s sinister predictions seem to be coming true. \n J.K. Rowling\'s internationally bestselling Harry Potter books continue to captivate new generations of readers. Harry\'s second adventure alongside his friends, Ron and Hermione, invites you to explore even more of the wizarding world; from the waving, walloping branches of the Whomping Willow to the thrills of a rain-streaked Quidditch pitch. This gorgeous hardback edition features a spectacular cover by award-winning artist Jonny Duddle, plus refreshed bonus material, allowing readers to learn about wand woods and get to know the many members of the Weasley family.'],

            ['key' => 'book_title harry_potter_y_el_prisionero_de_azkaban', 'language' => 'es', 'translation' => 'Harry Potter y el Prisionero de Azkaban'],
            ['key' => 'book_title harry_potter_y_el_prisionero_de_azkaban', 'language' => 'en', 'translation' => 'Harry Potter and the Prisoner of Azkaban'],
            ['key' => 'book_desc harry_potter_y_el_prisionero_de_azkaban', 'language' => 'es', 'translation' => 'Cuando el autobús noctámbulo irrumpe en una calle oscura y frena con fuertes chirridos delante de Harry, comienza para él un nuevo curso en Hogwarts, lleno de acontecimientos extraordinarios. Sirius Black, asesino y seguidor de lord Voldemort, se ha fugado, y dicen que va en busca de Harry. En su primera clase de Adivinación, la profesora Trelawney ve un augurio de muerte en las hojas de té de la taza de Harry... Pero quizá lo más aterrador sean los dementores que patrullan por los jardines del colegio, capaces de sorberte el alma con su beso...'],
            ['key' => 'book_desc harry_potter_y_el_prisionero_de_azkaban', 'language' => 'en', 'translation' => 'When the Knight Bus crashes through the darkness and screeches to a halt in front of him, it\'s the start of another far from ordinary year at Hogwarts for Harry Potter. Sirius Black, escaped mass-murderer and follower of Lord Voldemort, is on the run - and they say he is coming after Harry. In his first ever Divination class, Professor Trelawney sees an omen of death in Harry\'s tea leaves . But perhaps most terrifying of all are the Dementors patrolling the school grounds, with their soul-sucking Kiss. \n J.K. Rowling\'s internationally bestselling Harry Potter books continue to captivate new generations of readers. Harry\'s third adventure alongside his friends, Ron and Hermione, invites you to explore even more of the wizarding world; from the secret passages of Hogwarts castle to the snowy lanes of Hogsmeade. This gorgeous hardback edition features a spectacular cover by award-winning artist Jonny Duddle, plus refreshed bonus material, allowing readers to learn about famous witches and wizards and find out more about the Patronus Charm.'],

            ['key' => 'book_title harry_potter_y_el_caliz_de_fuego', 'language' => 'es', 'translation' => 'Harry Potter y el Cáliz de Fuego'],
            ['key' => 'book_title harry_potter_y_el_caliz_de_fuego', 'language' => 'en', 'translation' => 'Harry Potter and the Goblet of Fire'],
            ['key' => 'book_desc harry_potter_y_el_caliz_de_fuego', 'language' => 'es', 'translation' => 'Se va a celebrar en Hogwarts el Torneo de los Tres Magos. Sólo los alumnos mayores de diecisiete años pueden participar en esta competición, pero, aun así, Harry sueña con ganarla. En Halloween, cuando el cáliz de fuego elige a los campeones, Harry se lleva una sorpresa al ver que su nombre es uno de los escogidos por el cáliz mágico. Durante el torneo deberá enfrentarse a desafíos mortales, dragones y magos tenebrosos, pero con la ayuda de Ron y Hermione, sus mejores amigos, ¡quizá logre salir con vida!'],
            ['key' => 'book_desc harry_potter_y_el_caliz_de_fuego', 'language' => 'en', 'translation' => 'The Triwizard Tournament is to be held at Hogwarts. Only wizards who are over seventeen are allowed to enter - but that doesn\'t stop Harry dreaming that he will win the competition. Then at Halloween, when the Goblet of Fire makes its selection, Harry is amazed to find his name is one of those that the magical cup picks out. He will face death-defying tasks, dragons and Dark wizards, but with the help of his best friends, Ron and Hermione, he might just make it through - alive! \n J.K. Rowling\'s internationally bestselling Harry Potter books continue to captivate new generations of readers. Harry\'s fourth adventure invites you to explore even more of the wizarding world; from the foggy, frozen depths of the Great Lake to the silvery secrets of the Pensieve. This gorgeous hardback edition features a spectacular cover by award-winning artist Jonny Duddle, plus refreshed bonus material, allowing readers to learn more about the different breeds of dragon.'],

            ['key' => 'book_title harry_potter_y_la_orden_del_fenix', 'language' => 'es', 'translation' => 'Harry Potter y la Orden del Fénix'],
            ['key' => 'book_title harry_potter_y_la_orden_del_fenix', 'language' => 'en', 'translation' => 'Harry Potter and the Order of the Phoenix'],
            ['key' => 'book_desc harry_potter_y_la_orden_del_fenix', 'language' => 'es', 'translation' => 'Son malos tiempos para Hogwarts. Tras el ataque de los dementores a su primo Dudley, Harry Potter comprende que Voldemort no se detendrá ante nada para encontrarlo. Muchos niegan que el Señor Tenebroso haya regresado, pero Harry no está solo: una orden secreta se reúne en Grimmauld Place para luchar contra las fuerzas oscuras. Harry debe permitir que el profesor Snape le enseñe a protegerse de las brutales incursiones de Voldemort en su mente. Pero éstas son cada vez más potentes, y a Harry se le está agotando el tiempo...'],
            ['key' => 'book_desc harry_potter_y_la_orden_del_fenix', 'language' => 'en', 'translation' => 'Dark times have come to Hogwarts. After the Dementors\'s attack on his cousin Dudley, Harry Potter knows that Voldemort will stop at nothing to find him. There are many who deny the Dark Lord\'s return, but Harry is not alone: a secret order gathers at Grimmauld Place to fight against the Dark forces. Harry must allow Professor Snape to teach him how to protect himself from Voldemort\'s savage assaults on his mind. But they are growing stronger by the day and Harry is running out of time. \n J.K. Rowling\'s internationally bestselling Harry Potter books continue to captivate new generations of readers. Harry\'s fifth adventure alongside his friends, Ron and Hermione, invites you to explore even more of the wizarding world; from the sickly-sweet, kitten-clad walls of Professor Umbridge\'s office to the unplottable recesses of the Room of Requirement. This gorgeous hardback edition features a spectacular cover by award-winning artist Jonny Duddle, plus refreshed bonus material, including ten essential spells for any witch or wizard learning the art of self-defence.'],

            ['key' => 'book_title harry_potter_y_el_misterio_del_principe', 'language' => 'es', 'translation' => 'Harry Potter y el Misterio del Príncipe'],
            ['key' => 'book_title harry_potter_y_el_misterio_del_principe', 'language' => 'en', 'translation' => 'Harry Potter and the Half-Blood Prince'],
            ['key' => 'book_desc harry_potter_y_el_misterio_del_principe', 'language' => 'es', 'translation' => 'Con dieciséis años cumplidos, Harry inicia el sexto curso en Hogwarts en medio de terribles acontecimientos que asolan Inglaterra. Elegido capitán del equipo de quidditch, los ensayos, los exámenes y las chicas ocupan todo su tiempo, pero la tranquilidad dura poco. \n A pesar de los férreos controles de seguridad que protegen la escuela, dos alumnos son brutalmente atacados. Dumbledore sabe que se acerca el momento, anunciado por la Profecía, en que Harry y Voldemort se enfrentarán a muerte: «El único con poder para vencer al Señor Tenebroso se acerca... Uno de los dos debe morir a manos del otro, pues ninguno de los dos podrá vivir mientras siga el otro con vida.» \n El anciano director solicitará la ayuda de Harry y juntos emprenderán peligrosos viajes para intentar debilitar al enemigo, para lo cual el joven mago contará con un viejo libro de pociones perteneciente a un misterioso personaje, alguien que se hace llamar Príncipe Mestizo.'],
            ['key' => 'book_desc harry_potter_y_el_misterio_del_principe', 'language' => 'en', 'translation' => 'When Dumbledore arrives at Privet Drive one summer night to collect Harry Potter, his wand hand is blackened and shrivelled, but he does not reveal why. Secrets and suspicion are spreading through the wizarding world, and Hogwarts itself is not safe. Harry is convinced that Malfoy bears the Dark Mark: there is a Death Eater amongst them. Harry will need powerful magic and true friends as he explores Voldemort\'s darkest secrets, and Dumbledore prepares him to face his destiny. \n J.K. Rowling\'s internationally bestselling Harry Potter books continue to captivate new generations of readers. Harry\'s sixth adventure alongside his friends, Ron and Hermione, invites you to explore even more of the wizarding world; from the comforting cosiness of The Burrow to the brutal squalor of the Gaunt house. This gorgeous hardback edition features a spectacular cover by award-winning artist Jonny Duddle, plus refreshed bonus material, including a quiz to see how much you really know about the Dark Arts.'],

            ['key' => 'book_title harry_potter_y_las_reliquias_de_la_muerte', 'language' => 'es', 'translation' => 'Harry Potter y las Reliquias de la Muerte'],
            ['key' => 'book_title harry_potter_y_las_reliquias_de_la_muerte', 'language' => 'en', 'translation' => 'Harry Potter and the Deathly Hallows'],
            ['key' => 'book_desc harry_potter_y_las_reliquias_de_la_muerte', 'language' => 'es', 'translation' => 'Cuando se monta en el sidecar de la moto de Hagrid y se eleva en el cielo, dejando Privet Drive por última vez, Harry Potter sabe que lord Voldemort y sus mortífagos se hallan cerca. El encantamiento protector que había mantenido a salvo a Harry se ha roto, pero él no puede seguir escondiéndose. El Señor Tenebroso se dedica a aterrorizar a todos los seres queridos de Harry, y, para detenerlo, éste habrá de encontrar y destruir los horrocruxes que quedan. La batalla definitiva debe comenzar: Harry tendrá que alzarse y enfrentarse a su enemigo...'],
            ['key' => 'book_desc harry_potter_y_las_reliquias_de_la_muerte', 'language' => 'en', 'translation' => 'As he climbs into the sidecar of Hagrid\'s motorbike and takes to the skies, leaving Privet Drive for the last time, Harry Potter knows that Lord Voldemort and the Death Eaters are not far behind. The protective charm that has kept Harry safe until now is broken, but he cannot keep hiding. The Dark Lord is breathing fear into everything Harry loves, and to stop him Harry will have to find and destroy the remaining Horcruxes. The final battle must begin - Harry must stand and face his enemy. \n J.K. Rowling\'s internationally bestselling Harry Potter books continue to captivate new generations of readers. Harry\'s seventh adventure alongside his friends, Ron and Hermione, invites you to explore even more of the wizarding world; from the tombstones of Godric\'s Hollow to the sweeping grandeur of Malfoy Manor. This gorgeous hardback edition features a spectacular cover by award-winning artist Jonny Duddle, plus refreshed bonus material, including Albus Dumbledore\'s thoughts on a certain unbeatable wand made of elder.'],

            ['key' => 'book_title el_silmarillion', 'language' => 'es', 'translation' => 'El Silmarillion'],
            ['key' => 'book_title el_silmarillion', 'language' => 'en', 'translation' => 'The Silmarillion'],
            ['key' => 'book_desc el_silmarillion', 'language' => 'es', 'translation' => 'El Silmarillion cuenta la historia de la Primera Edad, el antiguo drama del que hablan los personajes de El Señor de los Anillos, y en cuyos acontecimientos algunos de ellos tomaron parte, como Elrond y Galadriel… Una obra de auténtica imaginación, una visión inspirada, legendaria o mítica, del interminable conflicto entre el deseo de poder y la capacidad de crear. '],
            ['key' => 'book_desc el_silmarillion', 'language' => 'en', 'translation' => 'The forerunner to The Lord of the Rings, The Silmarillion tells the earlier history of Middle-earth, recounting the events of the First and Second Ages, and introducing some of the key characters, such as Galadriel, Elrond, Elendil and the Dark Lord, Sauron. \n The Silmarillion is an account of the Elder Days, of the First Age of Tolkien’s world. It is the ancient drama to which the characters in The Lord of the Rings look back, and in whose events some of them such as Elrond and Galadriel took part. The tales of The Silmarillion are set in an age when Morgoth, the first Dark Lord, dwelt in Middle-Earth, and the High Elves made war upon him for the recovery of the Silmarils, the jewels containing the pure light of Valinor..'],

            ['key' => 'book_title el_hobbit', 'language' => 'es', 'translation' => 'El Hobbit'],
            ['key' => 'book_title el_hobbit', 'language' => 'en', 'translation' => 'The Hobbit'],
            ['key' => 'book_desc el_hobbit', 'language' => 'es', 'translation' => 'El Hobbit es la inolvidable historia de Bilbo, un hobbit pacífico, que emprende una extraña y mágica aventura. Un clásico atemporal. Bilbo Bolsón disfruta de una vida tranquila y contenta, sin deseo de viajar lejos de las comodidades del hogar; entonces un día el mago Gandalf y una banda de enanos llegan inesperadamente y reclutan sus servicios - como ladrón - en una peligrosa expedición para saquear el tesoro de Smaug el dragón. La vida de Bilbo nunca volverá a ser la misma.'],
            ['key' => 'book_desc el_hobbit', 'language' => 'en', 'translation' => 'The Hobbit is the unforgettable story of Bilbo, a peace-loving hobbit, who embarks on a strange and magical adventure. A timeless classic. Bilbo Baggins enjoys a quiet and contented life, with no desire to travel far from the comforts of home; then one day the wizard Gandalf and a band of dwarves arrive unexpectedly and enlist his services - as a burglar - on a dangerous expedition to raid the treasure-hoard of Smaug the dragon. Bilbo\'s life is never to be the same again.'],

            ['key' => 'book_title el_senor_de_los_anillos_la_comunidad_del_anillo', 'language' => 'es', 'translation' => 'El Señor de los Anillos: La Comunidad del Anillo'],
            ['key' => 'book_title el_senor_de_los_anillos_la_comunidad_del_anillo', 'language' => 'en', 'translation' => 'The Lord of the Rings: The Fellowship of the Ring'],
            ['key' => 'book_desc el_senor_de_los_anillos_la_comunidad_del_anillo', 'language' => 'es', 'translation' => 'En la apacible Comarca, un joven hobbit recibe un encargo: custodiar el Anillo Único y emprender el viaje para su destrucción en las Grietas del Destino.'],
            ['key' => 'book_desc el_senor_de_los_anillos_la_comunidad_del_anillo', 'language' => 'en', 'translation' => 'In the peaceful Shire, a young hobbit receives a mission: to guard the One Ring and embark on the journey to destroy it in the Cracks of Doom.'],

            ['key' => 'book_title el_senor_de_los_anillos_las_dos_torres', 'language' => 'es', 'translation' => 'El Señor de los Anillos: Las Dos Torres'],
            ['key' => 'book_title el_senor_de_los_anillos_las_dos_torres', 'language' => 'en', 'translation' => 'The Lord of the Rings: The Two Towers'],
            ['key' => 'book_desc el_senor_de_los_anillos_las_dos_torres', 'language' => 'es', 'translation' => 'La Comunidad del Anillo se ha disuelto. Frodo y Sam continúan solos su viaje a lo largo del río Anduin, perseguidos por la sombra misteriosa de un ser extraño que también ambiciona la posesión del Anillo.'],
            ['key' => 'book_desc el_senor_de_los_anillos_las_dos_torres', 'language' => 'en', 'translation' => 'The Fellowship of the Ring has been broken. Frodo and Sam continue their journey alone along the Anduin River, pursued by the mysterious shadow of a strange being who also covets the possession of the Ring.'],

            ['key' => 'book_title el_senor_de_los_anillos_el_retorno_del_rey', 'language' => 'es', 'translation' => 'El Señor de los Anillos: El Retorno del Rey'],
            ['key' => 'book_title el_señor_de_los_anillos_el_retorno_del_rey', 'language' => 'en', 'translation' => 'The Lord of the Rings: The Return of the King'],
            ['key' => 'book_desc el_senor_de_los_anillos_el_retorno_del_rey', 'language' => 'es', 'translation' => 'La guerra en la Tierra Media alcanza su clímax cuando los ejércitos de Sauron atacan Minas Tirith, la capital de Gondor.'],
            ['key' => 'book_desc el_senor_de_los_anillos_el_retorno_del_rey', 'language' => 'en', 'translation' => 'The war in Middle-earth reaches its climax when Sauron\'s armies attack Minas Tirith, the capital of Gondor.'],

            ['key' => 'book_title el_caballero_de_la_armadura_oxidada', 'language' => 'es', 'translation' => 'El Caballero de la Armadura Oxidada'],
            ['key' => 'book_title el_caballero_de_la_armadura_oxidada', 'language' => 'en', 'translation' => 'The Knight in Rusty Armor'],
            ['key' => 'book_desc el_caballero_de_la_armadura_oxidada', 'language' => 'es', 'translation' => 'El Caballero de la Armadura Oxidada es una novela de autoayuda del escritor estadounidense Robert Fisher. La obra fue publicada por primera vez en 1987.'],
            ['key' => 'book_desc el_caballero_de_la_armadura_oxidada', 'language' => 'en', 'translation' => 'The Knight in Rusty Armor is a self-help novel by American writer Robert Fisher. The work was first published in 1987.'],

            ['key' => 'book_title el_alquimista', 'language' => 'es', 'translation' => 'El Alquimista'],
            ['key' => 'book_title el_alquimista', 'language' => 'en', 'translation' => 'The Alchemist'],
            ['key' => 'book_desc el_alquimista', 'language' => 'es', 'translation' => 'El Alquimista es una novela del escritor brasileño Paulo Coelho, publicada por primera vez en 1988.'],
            ['key' => 'book_desc el_alquimista', 'language' => 'en', 'translation' => 'The Alchemist is a novel by Brazilian writer Paulo Coelho, first published in 1988.'],

            ['key' => 'book_title el_poder_del_metabolismo', 'language' => 'es', 'translation' => 'El Poder del Metabolismo'],
            ['key' => 'book_title el_poder_del_metabolismo', 'language' => 'en', 'translation' => 'The Power of Metabolism'],
            ['key' => 'book_desc el_poder_del_metabolismo', 'language' => 'es', 'translation' => 'El Poder del Metabolismo es un libro de autoayuda del médico mexicano Frank Suárez. La obra fue publicada por primera vez en 2008.'],
            ['key' => 'book_desc el_poder_del_metabolismo', 'language' => 'en', 'translation' => 'The Power of Metabolism is a self-help book by Mexican doctor Frank Suárez. The work was first published in 2008.'],

            ['key' => 'book_title el_poder_del_ahora', 'language' => 'es', 'translation' => 'El Poder del Ahora'],
            ['key' => 'book_title el_poder_del_ahora', 'language' => 'en', 'translation' => 'The Power of Now'],
            ['key' => 'book_desc el_poder_del_ahora', 'language' => 'es', 'translation' => 'El Poder del Ahora es un libro de autoayuda del escritor alemán Eckhart Tolle. La obra fue publicada por primera vez en 1997.'],
            ['key' => 'book_desc el_poder_del_ahora', 'language' => 'en', 'translation' => 'The Power of Now is a self-help book by German writer Eckhart Tolle. The work was first published in 1997.'],

            ['key' => 'book_title el_secreto', 'language' => 'es', 'translation' => 'El Secreto'],
            ['key' => 'book_title el_secreto', 'language' => 'en', 'translation' => 'The Secret'],
            ['key' => 'book_desc el_secreto', 'language' => 'es', 'translation' => 'El Secreto es un libro de autoayuda de la escritora australiana Rhonda Byrne. La obra fue publicada por primera vez en 2006.'],
            ['key' => 'book_desc el_secreto', 'language' => 'en', 'translation' => 'The Secret is a self-help book by Australian writer Rhonda Byrne. The work was first published in 2006.'],

            ['key' => 'book_title el_poder', 'language' => 'es', 'translation' => 'El Poder'],
            ['key' => 'book_title el_poder', 'language' => 'en', 'translation' => 'The Power'],
            ['key' => 'book_desc el_poder', 'language' => 'es', 'translation' => 'El Poder es un libro de autoayuda de la escritora australiana Rhonda Byrne. La obra fue publicada por primera vez en 2010.'],
            ['key' => 'book_desc el_poder', 'language' => 'en', 'translation' => 'The Power is a self-help book by Australian writer Rhonda Byrne. The work was first published in 2010.'],

            ['key' => 'book_title el_poder_de_la_mente_subconsciente', 'language' => 'es', 'translation' => 'El Poder de la Mente Subconsciente'],
            ['key' => 'book_title el_poder_de_la_mente_subconsciente', 'language' => 'en', 'translation' => 'The Power of the Subconscious Mind'],
            ['key' => 'book_desc el_poder_de_la_mente_subconsciente', 'language' => 'es', 'translation' => 'El Poder de la Mente Subconsciente es un libro de autoayuda del escritor estadounidense Joseph Murphy. La obra fue publicada por primera vez en 1963.'],
            ['key' => 'book_desc el_poder_de_la_mente_subconsciente', 'language' => 'en', 'translation' => 'The Power of the Subconscious Mind is a self-help book by American writer Joseph Murphy. The work was first published in 1963.'],

            ['key' => 'book_title el_poder_de_la_intencion', 'language' => 'es', 'translation' => 'El Poder de la Intención'],
            ['key' => 'book_title el_poder_de_la_intencion', 'language' => 'en', 'translation' => 'The Power of Intention'],
            ['key' => 'book_desc el_poder_de_la_intencion', 'language' => 'es', 'translation' => 'El Poder de la Intención es un libro de autoayuda del escritor estadounidense Wayne Dyer. La obra fue publicada por primera vez en 2004.'],
            ['key' => 'book_desc el_poder_de_la_intencion', 'language' => 'en', 'translation' => 'The Power of Intention is a self-help book by American writer Wayne Dyer. The work was first published in 2004.'],

            ['key' => 'book_title el_poder_de_los_habitos', 'language' => 'es', 'translation' => 'El Poder de los Hábitos'],
            ['key' => 'book_title el_poder_de_los_habitos', 'language' => 'en', 'translation' => 'The Power of Habits'],
            ['key' => 'book_desc el_poder_de_los_habitos', 'language' => 'es', 'translation' => 'El Poder de los Hábitos es un libro de autoayuda del escritor estadounidense Charles Duhigg. La obra fue publicada por primera vez en 2012.'],
            ['key' => 'book_desc el_poder_de_los_habitos', 'language' => 'en', 'translation' => 'The Power of Habits is a self-help book by American writer Charles Duhigg. The work was first published in 2012.'],

            ['key' => 'book_title el_poder_de_la_esperanza', 'language' => 'es', 'translation' => 'El Poder de la Esperanza'],
            ['key' => 'book_title el_poder_de_la_esperanza', 'language' => 'en', 'translation' => 'The Power of Hope'],
            ['key' => 'book_desc el_poder_de_la_esperanza', 'language' => 'es', 'translation' => 'El Poder de la Esperanza es un libro de autoayuda del escritor estadounidense Wayne Dyer. La obra fue publicada por primera vez en 2008.'],
            ['key' => 'book_desc el_poder_de_la_esperanza', 'language' => 'en', 'translation' => 'The Power of Hope is a self-help book by American writer Wayne Dyer. The work was first published in 2008.'],

            ['key' => 'book_title el_poder_de_la_palabra', 'language' => 'es', 'translation' => 'El Poder de la Palabra'],
            ['key' => 'book_title el_poder_de_la_palabra', 'language' => 'en', 'translation' => 'The Power of the Word'],
            ['key' => 'book_desc el_poder_de_la_palabra', 'language' => 'es', 'translation' => 'El Poder de la Palabra es un libro de autoayuda del escritor estadounidense Florence Scovel Shinn. La obra fue publicada por primera vez en 1925.'],
            ['key' => 'book_desc el_poder_de_la_palabra', 'language' => 'en', 'translation' => 'The Power of the Word is a self-help book by American writer Florence Scovel Shinn. The work was first published in 1925.'],

            // Categorías y sus descripciones
            ['key' => 'cat_name fantasia', 'language' => 'es', 'translation' => 'Fantasía'],
            ['key' => 'cat_name fantasia', 'language' => 'en', 'translation' => 'Fantasy'],
            ['key' => 'cat_desc fantasia', 'language' => 'es', 'translation' => 'Libros de fantasía'],
            ['key' => 'cat_desc fantasia', 'language' => 'en', 'translation' => 'Fantasy books'],

            ['key' => 'cat_name clasicos', 'language' => 'es', 'translation' => 'Clásicos'],
            ['key' => 'cat_name clasicos', 'language' => 'en', 'translation' => 'Classics'],
            ['key' => 'cat_desc clasicos', 'language' => 'es', 'translation' => 'Libros clásicos'],
            ['key' => 'cat_desc clasicos', 'language' => 'en', 'translation' => 'Classic books'],

            ['key' => 'cat_name ficcion', 'language' => 'es', 'translation' => 'Ficción'],
            ['key' => 'cat_name ficcion', 'language' => 'en', 'translation' => 'Fiction'],
            ['key' => 'cat_desc ficcion', 'language' => 'es', 'translation' => 'Libros de ficción'],
            ['key' => 'cat_desc ficcion', 'language' => 'en', 'translation' => 'Fiction books'],

            ['key' => 'cat_name no-ficcion', 'language' => 'es', 'translation' => 'No ficción'],
            ['key' => 'cat_name no-ficcion', 'language' => 'en', 'translation' => 'Non-fiction'],
            ['key' => 'cat_desc no-ficcion', 'language' => 'es', 'translation' => 'Libros de no ficción'],
            ['key' => 'cat_desc no-ficcion', 'language' => 'en', 'translation' => 'Non-fiction books'],

            ['key' => 'cat_name romance', 'language' => 'es', 'translation' => 'Romance'],
            ['key' => 'cat_name romance', 'language' => 'en', 'translation' => 'Romance'],
            ['key' => 'cat_desc romance', 'language' => 'es', 'translation' => 'Libros de romance'],
            ['key' => 'cat_desc romance', 'language' => 'en', 'translation' => 'Romance books'],

            ['key' => 'cat_name jovenes-adultos', 'language' => 'es', 'translation' => 'Jóvenes adultos'],
            ['key' => 'cat_name jovenes-adultos', 'language' => 'en', 'translation' => 'Young adults'],
            ['key' => 'cat_desc jovenes-adultos', 'language' => 'es', 'translation' => 'Libros para jóvenes adultos'],
            ['key' => 'cat_desc jovenes-adultos', 'language' => 'en', 'translation' => 'Books for young adults'],

            ['key' => 'cat_name arte', 'language' => 'es', 'translation' => 'Arte'],
            ['key' => 'cat_name arte', 'language' => 'en', 'translation' => 'Art'],
            ['key' => 'cat_desc arte', 'language' => 'es', 'translation' => 'Libros de arte'],
            ['key' => 'cat_desc arte', 'language' => 'en', 'translation' => 'Art books'],

            ['key' => 'cat_name biografias', 'language' => 'es', 'translation' => 'Biografías'],
            ['key' => 'cat_name biografias', 'language' => 'en', 'translation' => 'Biographies'],
            ['key' => 'cat_desc biografias', 'language' => 'es', 'translation' => 'Libros de biografías'],
            ['key' => 'cat_desc biografias', 'language' => 'en', 'translation' => 'Biography books'],

            ['key' => 'cat_name negocio', 'language' => 'es', 'translation' => 'Negocios'],
            ['key' => 'cat_name negocio', 'language' => 'en', 'translation' => 'Business'],
            ['key' => 'cat_desc negocio', 'language' => 'es', 'translation' => 'Libros de negocios'],
            ['key' => 'cat_desc negocio', 'language' => 'en', 'translation' => 'Business books'],

            ['key' => 'cat_name infantil', 'language' => 'es', 'translation' => 'Infantil'],
            ['key' => 'cat_name infantil', 'language' => 'en', 'translation' => 'Children'],
            ['key' => 'cat_desc infantil', 'language' => 'es', 'translation' => 'Libros infantiles'],
            ['key' => 'cat_desc infantil', 'language' => 'en', 'translation' => 'Children books'],

            ['key' => 'cat_name religion', 'language' => 'es', 'translation' => 'Religión'],
            ['key' => 'cat_name religion', 'language' => 'en', 'translation' => 'Religion'],
            ['key' => 'cat_desc religion', 'language' => 'es', 'translation' => 'Libros de religión'],
            ['key' => 'cat_desc religion', 'language' => 'en', 'translation' => 'Religion books'],

            ['key' => 'cat_name ebooks', 'language' => 'es', 'translation' => 'Ebooks'],
            ['key' => 'cat_name ebooks', 'language' => 'en', 'translation' => 'Ebooks'],
            ['key' => 'cat_desc ebooks', 'language' => 'es', 'translation' => 'Libros electrónicos'],
            ['key' => 'cat_desc ebooks', 'language' => 'en', 'translation' => 'Ebook books'],

            ['key' => 'cat_name novelas-graficas', 'language' => 'es', 'translation' => 'Novelas gráficas'],
            ['key' => 'cat_name novelas-graficas', 'language' => 'en', 'translation' => 'Graphic novels'],
            ['key' => 'cat_desc novelas-graficas', 'language' => 'es', 'translation' => 'Libros de novelas gráficas'],
            ['key' => 'cat_desc novelas-graficas', 'language' => 'en', 'translation' => 'Graphic novel books'],

            ['key' => 'cat_name terror', 'language' => 'es', 'translation' => 'Terror'],
            ['key' => 'cat_name terror', 'language' => 'en', 'translation' => 'Horror'],
            ['key' => 'cat_desc terror', 'language' => 'es', 'translation' => 'Libros de terror'],
            ['key' => 'cat_desc terror', 'language' => 'en', 'translation' => 'Horror books'],

            ['key' => 'cat_name lgtbi', 'language' => 'es', 'translation' => 'LGTBI'],
            ['key' => 'cat_name lgtbi', 'language' => 'en', 'translation' => 'LGBTQ+'],
            ['key' => 'cat_desc lgtbi', 'language' => 'es', 'translation' => 'Libros sobre temática LGTBI'],
            ['key' => 'cat_desc lgtbi', 'language' => 'en', 'translation' => 'LGBTQ+ books'],

            ['key' => 'cat_name chick-lit', 'language' => 'es', 'translation' => 'Chick-lit'],
            ['key' => 'cat_name chick-lit', 'language' => 'en', 'translation' => 'Chick-lit'],
            ['key' => 'cat_desc chick-lit', 'language' => 'es', 'translation' => 'Libros de chick-lit'],
            ['key' => 'cat_desc chick-lit', 'language' => 'en', 'translation' => 'Chick-lit books'],

            ['key' => 'cat_name contemporaneo', 'language' => 'es', 'translation' => 'Contemporáneo'],
            ['key' => 'cat_name contemporaneo', 'language' => 'en', 'translation' => 'Contemporary'],
            ['key' => 'cat_desc contemporaneo', 'language' => 'es', 'translation' => 'Libros de ficción contemporánea'],
            ['key' => 'cat_desc contemporaneo', 'language' => 'en', 'translation' => 'Contemporary fiction books'],

            ['key' => 'cat_name manga', 'language' => 'es', 'translation' => 'Manga'],
            ['key' => 'cat_name manga', 'language' => 'en', 'translation' => 'Manga'],
            ['key' => 'cat_desc manga', 'language' => 'es', 'translation' => 'Libros de manga'],
            ['key' => 'cat_desc manga', 'language' => 'en', 'translation' => 'Manga books'],

            ['key' => 'cat_name manhua', 'language' => 'es', 'translation' => 'Manhua'],
            ['key' => 'cat_name manhua', 'language' => 'en', 'translation' => 'Manhua'],
            ['key' => 'cat_desc manhua', 'language' => 'es', 'translation' => 'Libros de manhua'],
            ['key' => 'cat_desc manhua', 'language' => 'en', 'translation' => 'Manhua books'],

            ['key' => 'cat_name manhwa', 'language' => 'es', 'translation' => 'Manhwa'],
            ['key' => 'cat_name manhwa', 'language' => 'en', 'translation' => 'Manhwa'],
            ['key' => 'cat_desc manhwa', 'language' => 'es', 'translation' => 'Libros de manhwa'],
            ['key' => 'cat_desc manhwa', 'language' => 'en', 'translation' => 'Manhwa books'],

            ['key' => 'cat_name paranormal', 'language' => 'es', 'translation' => 'Paranormal'],
            ['key' => 'cat_name paranormal', 'language' => 'en', 'translation' => 'Paranormal'],
            ['key' => 'cat_desc paranormal', 'language' => 'es', 'translation' => 'Libros de temática paranormal'],
            ['key' => 'cat_desc paranormal', 'language' => 'en', 'translation' => 'Paranormal books'],

            ['key' => 'cat_name comics', 'language' => 'es', 'translation' => 'Cómics'],
            ['key' => 'cat_name comics', 'language' => 'en', 'translation' => 'Comics'],
            ['key' => 'cat_desc comics', 'language' => 'es', 'translation' => 'Libros de cómics'],
            ['key' => 'cat_desc comics', 'language' => 'en', 'translation' => 'Comic books'],

            ['key' => 'cat_name cocina', 'language' => 'es', 'translation' => 'Cocina'],
            ['key' => 'cat_name cocina', 'language' => 'en', 'translation' => 'Cooking'],
            ['key' => 'cat_desc cocina', 'language' => 'es', 'translation' => 'Libros de cocina'],
            ['key' => 'cat_desc cocina', 'language' => 'en', 'translation' => 'Cooking books'],

            ['key' => 'cat_name historia', 'language' => 'es', 'translation' => 'Historia'],
            ['key' => 'cat_name historia', 'language' => 'en', 'translation' => 'History'],
            ['key' => 'cat_desc historia', 'language' => 'es', 'translation' => 'Libros de historia'],
            ['key' => 'cat_desc historia', 'language' => 'en', 'translation' => 'History books'],

            ['key' => 'cat_name humor', 'language' => 'es', 'translation' => 'Humor'],
            ['key' => 'cat_name humor', 'language' => 'en', 'translation' => 'Humor'],
            ['key' => 'cat_desc humor', 'language' => 'es', 'translation' => 'Libros de humor'],
            ['key' => 'cat_desc humor', 'language' => 'en', 'translation' => 'Humor books'],

            ['key' => 'cat_name misterio', 'language' => 'es', 'translation' => 'Misterio'],
            ['key' => 'cat_name misterio', 'language' => 'en', 'translation' => 'Mystery'],
            ['key' => 'cat_desc misterio', 'language' => 'es', 'translation' => 'Libros de misterio'],
            ['key' => 'cat_desc misterio', 'language' => 'en', 'translation' => 'Mystery books'],

            ['key' => 'cat_name poesia', 'language' => 'es', 'translation' => 'Poesía'],
            ['key' => 'cat_name poesia', 'language' => 'en', 'translation' => 'Poetry'],
            ['key' => 'cat_desc poesia', 'language' => 'es', 'translation' => 'Libros de poesía'],
            ['key' => 'cat_desc poesia', 'language' => 'en', 'translation' => 'Poetry books'],

            ['key' => 'cat_name politica', 'language' => 'es', 'translation' => 'Política'],
            ['key' => 'cat_name politica', 'language' => 'en', 'translation' => 'Politics'],
            ['key' => 'cat_desc politica', 'language' => 'es', 'translation' => 'Libros de política'],
            ['key' => 'cat_desc politica', 'language' => 'en', 'translation' => 'Politics books'],

            ['key' => 'cat_name ciencia', 'language' => 'es', 'translation' => 'Ciencia'],
            ['key' => 'cat_name ciencia', 'language' => 'en', 'translation' => 'Science'],
            ['key' => 'cat_desc ciencia', 'language' => 'es', 'translation' => 'Libros de ciencia'],
            ['key' => 'cat_desc ciencia', 'language' => 'en', 'translation' => 'Science books'],

            ['key' => 'cat_name deportes', 'language' => 'es', 'translation' => 'Deportes'],
            ['key' => 'cat_name deportes', 'language' => 'en', 'translation' => 'Sports'],
            ['key' => 'cat_desc deportes', 'language' => 'es', 'translation' => 'Libros de deportes'],
            ['key' => 'cat_desc deportes', 'language' => 'en', 'translation' => 'Sports books'],

            ['key' => 'cat_name autoayuda', 'language' => 'es', 'translation' => 'Autoayuda'],
            ['key' => 'cat_name autoayuda', 'language' => 'en', 'translation' => 'Self-help'],
            ['key' => 'cat_desc autoayuda', 'language' => 'es', 'translation' => 'Libros de autoayuda'],
            ['key' => 'cat_desc autoayuda', 'language' => 'en', 'translation' => 'Self-help books'],

            ['key' => 'cat_name thriller', 'language' => 'es', 'translation' => 'Thriller'],
            ['key' => 'cat_name thriller', 'language' => 'en', 'translation' => 'Thriller'],
            ['key' => 'cat_desc thriller', 'language' => 'es', 'translation' => 'Libros de thriller'],
            ['key' => 'cat_desc thriller', 'language' => 'en', 'translation' => 'Thriller books'],

            ['key' => 'cat_name suspense', 'language' => 'es', 'translation' => 'Suspense'],
            ['key' => 'cat_name suspense', 'language' => 'en', 'translation' => 'Suspense'],
            ['key' => 'cat_desc suspense', 'language' => 'es', 'translation' => 'Libros de suspense'],
            ['key' => 'cat_desc suspense', 'language' => 'en', 'translation' => 'Suspense books'],

            ['key' => 'cat_name psicologia', 'language' => 'es', 'translation' => 'Psicología'],
            ['key' => 'cat_name psicologia', 'language' => 'en', 'translation' => 'Psychology'],
            ['key' => 'cat_desc psicologia', 'language' => 'es', 'translation' => 'Libros de psicología'],
            ['key' => 'cat_desc psicologia', 'language' => 'en', 'translation' => 'Psychology books'],

            ['key' => 'cat_name crimen', 'language' => 'es', 'translation' => 'Crimen'],
            ['key' => 'cat_name crimen', 'language' => 'en', 'translation' => 'Crime'],
            ['key' => 'cat_desc crimen', 'language' => 'es', 'translation' => 'Libros de crimen'],
            ['key' => 'cat_desc crimen', 'language' => 'en', 'translation' => 'Crime books'],

            ['key' => 'cat_name viajes', 'language' => 'es', 'translation' => 'Viajes'],
            ['key' => 'cat_name viajes', 'language' => 'en', 'translation' => 'Travel'],
            ['key' => 'cat_desc viajes', 'language' => 'es', 'translation' => 'Libros de viajes'],
            ['key' => 'cat_desc viajes', 'language' => 'en', 'translation' => 'Travel books'],

            // Subcategorías de la categoría Fantasía
            ['key' => 'subcat_name fantasia_epica', 'language' => 'es', 'translation' => 'Fantasía épica'],
            ['key' => 'subcat_name fantasia_epica', 'language' => 'en', 'translation' => 'Epic fantasy'],
            ['key' => 'subcat_desc fantasia_epica', 'language' => 'es', 'translation' => 'Libros de fantasía épica'],
            ['key' => 'subcat_desc fantasia_epica', 'language' => 'en', 'translation' => 'Epic fantasy books'],

            ['key' => 'subcat_name fantasia_infantil', 'language' => 'es', 'translation' => 'Fantasía infantil'],
            ['key' => 'subcat_name fantasia_infantil', 'language' => 'en', 'translation' => 'Children fantasy'],
            ['key' => 'subcat_desc fantasia_infantil', 'language' => 'es', 'translation' => 'Libros de fantasía infantil'],
            ['key' => 'subcat_desc fantasia_infantil', 'language' => 'en', 'translation' => 'Children fantasy books'],

            ['key' => 'subcat_name fantasia_heroica', 'language' => 'es', 'translation' => 'Fantasía heroica'],
            ['key' => 'subcat_name fantasia_heroica', 'language' => 'en', 'translation' => 'Heroic fantasy'],
            ['key' => 'subcat_desc fantasia_heroica', 'language' => 'es', 'translation' => 'Libros de fantasía heroica'],
            ['key' => 'subcat_desc fantasia_heroica', 'language' => 'en', 'translation' => 'Heroic fantasy books'],


            ['key' => 'subcat_name fantasia_juvenil', 'language' => 'es', 'translation' => 'Fantasía juvenil'],
            ['key' => 'subcat_name fantasia_juvenil', 'language' => 'en', 'translation' => 'Young adult fantasy'],
            ['key' => 'subcat_desc fantasia_juvenil', 'language' => 'es', 'translation' => 'Libros de fantasía juvenil'],
            ['key' => 'subcat_desc fantasia_juvenil', 'language' => 'en', 'translation' => 'Young adult fantasy books'],

            ['key' => 'subcat_name fantasia_urbana', 'language' => 'es', 'translation' => 'Fantasía urbana'],
            ['key' => 'subcat_name fantasia_urbana', 'language' => 'en', 'translation' => 'Urban fantasy'],
            ['key' => 'subcat_desc fantasia_urbana', 'language' => 'es', 'translation' => 'Libros de fantasía urbana'],
            ['key' => 'subcat_desc fantasia_urbana', 'language' => 'en', 'translation' => 'Urban fantasy books'],

            ['key' => 'subcat_name fantasia_historica', 'language' => 'es', 'translation' => 'Fantasía histórica'],
            ['key' => 'subcat_name fantasia_historica', 'language' => 'en', 'translation' => 'Historical fantasy'],
            ['key' => 'subcat_desc fantasia_historica', 'language' => 'es', 'translation' => 'Libros de fantasía histórica'],
            ['key' => 'subcat_desc fantasia_historica', 'language' => 'en', 'translation' => 'Historical fantasy books'],

            ['key' => 'subcat_name fantasia_romantica', 'language' => 'es', 'translation' => 'Fantasía romántica'],
            ['key' => 'subcat_name fantasia_romantica', 'language' => 'en', 'translation' => 'Romantic fantasy'],
            ['key' => 'subcat_desc fantasia_romantica', 'language' => 'es', 'translation' => 'Libros de fantasía romántica'],
            ['key' => 'subcat_desc fantasia_romantica', 'language' => 'en', 'translation' => 'Romantic fantasy books'],

            ['key' => 'subcat_name fantasia_ciencia_ficcion', 'language' => 'es', 'translation' => 'Fantasía ciencia ficción'],
            ['key' => 'subcat_name fantasia_ciencia_ficcion', 'language' => 'en', 'translation' => 'Science fiction fantasy'],
            ['key' => 'subcat_desc fantasia_ciencia_ficcion', 'language' => 'es', 'translation' => 'Libros de fantasía ciencia ficción'],
            ['key' => 'subcat_desc fantasia_ciencia_ficcion', 'language' => 'en', 'translation' => 'Science fiction fantasy books'],

            // Subcategorías de la categoría Clásicos
            ['key' => 'subcat_name clasicos_griegos', 'language' => 'es', 'translation' => 'Clásicos griegos'],
            ['key' => 'subcat_name clasicos_griegos', 'language' => 'en', 'translation' => 'Greek classics'],
            ['key' => 'subcat_desc clasicos_griegos', 'language' => 'es', 'translation' => 'Libros de clásicos griegos'],
            ['key' => 'subcat_desc clasicos_griegos', 'language' => 'en', 'translation' => 'Greek classics books'],

            ['key' => 'subcat_name clasicos_latinos', 'language' => 'es', 'translation' => 'Clásicos latinos'],
            ['key' => 'subcat_name clasicos_latinos', 'language' => 'en', 'translation' => 'Latin classics'],
            ['key' => 'subcat_desc clasicos_latinos', 'language' => 'es', 'translation' => 'Libros de clásicos latinos'],
            ['key' => 'subcat_desc clasicos_latinos', 'language' => 'en', 'translation' => 'Latin classics books'],

            ['key' => 'subcat_name clasicos_ingleses', 'language' => 'es', 'translation' => 'Clásicos ingleses'],
            ['key' => 'subcat_name clasicos_ingleses', 'language' => 'en', 'translation' => 'English classics'],
            ['key' => 'subcat_desc clasicos_ingleses', 'language' => 'es', 'translation' => 'Libros de clásicos ingleses'],
            ['key' => 'subcat_desc clasicos_ingleses', 'language' => 'en', 'translation' => 'English classics books'],

            ['key' => 'subcat_name clasicos_espanoles', 'language' => 'es', 'translation' => 'Clásicos españoles'],
            ['key' => 'subcat_name clasicos_espanoles', 'language' => 'en', 'translation' => 'Spanish classics'],
            ['key' => 'subcat_desc clasicos_espanoles', 'language' => 'es', 'translation' => 'Libros de clásicos españoles'],
            ['key' => 'subcat_desc clasicos_espanoles', 'language' => 'en', 'translation' => 'Spanish classics books'],

            ['key' => 'subcat_name clasicos_rusos', 'language' => 'es', 'translation' => 'Clásicos rusos'],
            ['key' => 'subcat_name clasicos_rusos', 'language' => 'en', 'translation' => 'Russian classics'],
            ['key' => 'subcat_desc clasicos_rusos', 'language' => 'es', 'translation' => 'Libros de clásicos rusos'],
            ['key' => 'subcat_desc clasicos_rusos', 'language' => 'en', 'translation' => 'Russian classics books'],

            ['key' => 'subcat_name clasicos_franceses', 'language' => 'es', 'translation' => 'Clásicos franceses'],
            ['key' => 'subcat_name clasicos_franceses', 'language' => 'en', 'translation' => 'French classics'],
            ['key' => 'subcat_desc clasicos_franceses', 'language' => 'es', 'translation' => 'Libros de clásicos franceses'],
            ['key' => 'subcat_desc clasicos_franceses', 'language' => 'en', 'translation' => 'French classics books'],

            ['key' => 'subcat_name clasicos_alemanes', 'language' => 'es', 'translation' => 'Clásicos alemanes'],
            ['key' => 'subcat_name clasicos_alemanes', 'language' => 'en', 'translation' => 'German classics'],
            ['key' => 'subcat_desc clasicos_alemanes', 'language' => 'es', 'translation' => 'Libros de clásicos alemanes'],
            ['key' => 'subcat_desc clasicos_alemanes', 'language' => 'en', 'translation' => 'German classics books'],

            ['key' => 'subcat_name clasicos_portugueses', 'language' => 'es', 'translation' => 'Clásicos portugueses'],
            ['key' => 'subcat_name clasicos_portugueses', 'language' => 'en', 'translation' => 'Portuguese classics'],
            ['key' => 'subcat_desc clasicos_portugueses', 'language' => 'es', 'translation' => 'Libros de clásicos portugueses'],
            ['key' => 'subcat_desc clasicos_portugueses', 'language' => 'en', 'translation' => 'Portuguese classics books'],

            ['key' => 'subcat_name clasicos_italianos', 'language' => 'es', 'translation' => 'Clásicos italianos'],
            ['key' => 'subcat_name clasicos_italianos', 'language' => 'en', 'translation' => 'Italian classics'],
            ['key' => 'subcat_desc clasicos_italianos', 'language' => 'es', 'translation' => 'Libros de clásicos italianos'],
            ['key' => 'subcat_desc clasicos_italianos', 'language' => 'en', 'translation' => 'Italian classics books'],

            ['key' => 'subcat_name clasicos_chinos', 'language' => 'es', 'translation' => 'Clásicos chinos'],
            ['key' => 'subcat_name clasicos_chinos', 'language' => 'en', 'translation' => 'Chinese classics'],
            ['key' => 'subcat_desc clasicos_chinos', 'language' => 'es', 'translation' => 'Libros de clásicos chinos'],
            ['key' => 'subcat_desc clasicos_chinos', 'language' => 'en', 'translation' => 'Chinese classics books'],

            ['key' => 'subcat_name clasicos_japoneses', 'language' => 'es', 'translation' => 'Clásicos japoneses'],
            ['key' => 'subcat_name clasicos_japoneses', 'language' => 'en', 'translation' => 'Japanese classics'],
            ['key' => 'subcat_desc clasicos_japoneses', 'language' => 'es', 'translation' => 'Libros de clásicos japoneses'],
            ['key' => 'subcat_desc clasicos_japoneses', 'language' => 'en', 'translation' => 'Japanese classics books'],

            ['key' => 'subcat_name clasicos_arabes', 'language' => 'es', 'translation' => 'Clásicos árabes'],
            ['key' => 'subcat_name clasicos_arabes', 'language' => 'en', 'translation' => 'Arabic classics'],
            ['key' => 'subcat_desc clasicos_arabes', 'language' => 'es', 'translation' => 'Libros de clásicos árabes'],
            ['key' => 'subcat_desc clasicos_arabes', 'language' => 'en', 'translation' => 'Arabic classics books'],

            ['key' => 'subcat_name clasicos_indios', 'language' => 'es', 'translation' => 'Clásicos indios'],
            ['key' => 'subcat_name clasicos_indios', 'language' => 'en', 'translation' => 'Indian classics'],
            ['key' => 'subcat_desc clasicos_indios', 'language' => 'es', 'translation' => 'Libros de clásicos indios'],
            ['key' => 'subcat_desc clasicos_indios', 'language' => 'en', 'translation' => 'Indian classics books'],

            ['key' => 'subcat_name clasicos_africanos', 'language' => 'es', 'translation' => 'Clásicos africanos'],
            ['key' => 'subcat_name clasicos_africanos', 'language' => 'en', 'translation' => 'African classics'],
            ['key' => 'subcat_desc clasicos_africanos', 'language' => 'es', 'translation' => 'Libros de clásicos africanos'],
            ['key' => 'subcat_desc clasicos_africanos', 'language' => 'en', 'translation' => 'African classics books'],

            ['key' => 'subcat_name clasicos_nordicos', 'language' => 'es', 'translation' => 'Clásicos nórdicos'],
            ['key' => 'subcat_name clasicos_nordicos', 'language' => 'en', 'translation' => 'Nordic classics'],
            ['key' => 'subcat_desc clasicos_nordicos', 'language' => 'es', 'translation' => 'Libros de clásicos nórdicos'],
            ['key' => 'subcat_desc clasicos_nordicos', 'language' => 'en', 'translation' => 'Nordic classics books'],

            ['key' => 'subcat_name clasicos_eslavos', 'language' => 'es', 'translation' => 'Clásicos eslavos'],
            ['key' => 'subcat_name clasicos_eslavos', 'language' => 'en', 'translation' => 'Slavic classics'],
            ['key' => 'subcat_desc clasicos_eslavos', 'language' => 'es', 'translation' => 'Libros de clásicos eslavos'],
            ['key' => 'subcat_desc clasicos_eslavos', 'language' => 'en', 'translation' => 'Slavic classics books'],

            // Subcategorías de la categoría Romance
            ['key' => 'subcat_name romance_historico', 'language' => 'es', 'translation' => 'Romance histórico'],
            ['key' => 'subcat_name romance_historico', 'language' => 'en', 'translation' => 'Historical romance'],
            ['key' => 'subcat_desc romance_historico', 'language' => 'es', 'translation' => 'Libros de romance histórico'],
            ['key' => 'subcat_desc romance_historico', 'language' => 'en', 'translation' => 'Historical romance books'],

            ['key' => 'subcat_name romance_contemporaneo', 'language' => 'es', 'translation' => 'Romance contemporáneo'],
            ['key' => 'subcat_name romance_contemporaneo', 'language' => 'en', 'translation' => 'Contemporary romance'],
            ['key' => 'subcat_desc romance_contemporaneo', 'language' => 'es', 'translation' => 'Libros de romance contemporáneo'],
            ['key' => 'subcat_desc romance_contemporaneo', 'language' => 'en', 'translation' => 'Contemporary romance books'],

            ['key' => 'subcat_name romance_erotico', 'language' => 'es', 'translation' => 'Romance erótico'],
            ['key' => 'subcat_name romance_erotico', 'language' => 'en', 'translation' => 'Erotic romance'],
            ['key' => 'subcat_desc romance_erotico', 'language' => 'es', 'translation' => 'Libros de romance erótico'],
            ['key' => 'subcat_desc romance_erotico', 'language' => 'en', 'translation' => 'Erotic romance books'],

            ['key' => 'subcat_name romance_juvenil', 'language' => 'es', 'translation' => 'Romance juvenil'],
            ['key' => 'subcat_name romance_juvenil', 'language' => 'en', 'translation' => 'Young adult romance'],
            ['key' => 'subcat_desc romance_juvenil', 'language' => 'es', 'translation' => 'Libros de romance juvenil'],
            ['key' => 'subcat_desc romance_juvenil', 'language' => 'en', 'translation' => 'Young adult romance books'],

            ['key' => 'subcat_name romance_lgtbi', 'language' => 'es', 'translation' => 'Romance LGTBI'],
            ['key' => 'subcat_name romance_lgtbi', 'language' => 'en', 'translation' => 'LGBTQ+ romance'],
            ['key' => 'subcat_desc romance_lgtbi', 'language' => 'es', 'translation' => 'Libros de romance LGTBI'],
            ['key' => 'subcat_desc romance_lgtbi', 'language' => 'en', 'translation' => 'LGBTQ+ romance books'],

            ['key' => 'subcat_name romance_suspense', 'language' => 'es', 'translation' => 'Romance suspense'],
            ['key' => 'subcat_name romance_suspense', 'language' => 'en', 'translation' => 'Suspense romance'],
            ['key' => 'subcat_desc romance_suspense', 'language' => 'es', 'translation' => 'Libros de romance suspense'],
            ['key' => 'subcat_desc romance_suspense', 'language' => 'en', 'translation' => 'Suspense romance books'],

            ['key' => 'subcat_name romance_misterio', 'language' => 'es', 'translation' => 'Romance misterio'],
            ['key' => 'subcat_name romance_misterio', 'language' => 'en', 'translation' => 'Mystery romance'],
            ['key' => 'subcat_desc romance_misterio', 'language' => 'es', 'translation' => 'Libros de romance misterio'],
            ['key' => 'subcat_desc romance_misterio', 'language' => 'en', 'translation' => 'Mystery romance books'],

            ['key' => 'subcat_name romance_fantasia', 'language' => 'es', 'translation' => 'Romance fantasía'],
            ['key' => 'subcat_name romance_fantasia', 'language' => 'en', 'translation' => 'Fantasy romance'],
            ['key' => 'subcat_desc romance_fantasia', 'language' => 'es', 'translation' => 'Libros de romance fantasía'],
            ['key' => 'subcat_desc romance_fantasia', 'language' => 'en', 'translation' => 'Fantasy romance books'],

            // Subcategorías de la categoría Manga
            ['key' => 'subcat_name manga_shonen', 'language' => 'es', 'translation' => 'Manga shonen'],
            ['key' => 'subcat_name manga_shonen', 'language' => 'en', 'translation' => 'Shonen manga'],
            ['key' => 'subcat_desc manga_shonen', 'language' => 'es', 'translation' => 'Manga shonen'],
            ['key' => 'subcat_desc manga_shonen', 'language' => 'en', 'translation' => 'Shonen manga books'],

            ['key' => 'subcat_name manga_shojo', 'language' => 'es', 'translation' => 'Manga shojo'],
            ['key' => 'subcat_name manga_shojo', 'language' => 'en', 'translation' => 'Shojo manga'],
            ['key' => 'subcat_desc manga_shojo', 'language' => 'es', 'translation' => 'Manga shojo'],
            ['key' => 'subcat_desc manga_shojo', 'language' => 'en', 'translation' => 'Shojo manga books'],

            ['key' => 'subcat_name manga_seinen', 'language' => 'es', 'translation' => 'Manga seinen'],
            ['key' => 'subcat_name manga_seinen', 'language' => 'en', 'translation' => 'Seinen manga'],
            ['key' => 'subcat_desc manga_seinen', 'language' => 'es', 'translation' => 'Manga seinen'],
            ['key' => 'subcat_desc manga_seinen', 'language' => 'en', 'translation' => 'Seinen manga books'],

            ['key' => 'subcat_name manga_josei', 'language' => 'es', 'translation' => 'Manga josei'],
            ['key' => 'subcat_name manga_josei', 'language' => 'en', 'translation' => 'Josei manga'],
            ['key' => 'subcat_desc manga_josei', 'language' => 'es', 'translation' => 'Manga josei'],
            ['key' => 'subcat_desc manga_josei', 'language' => 'en', 'translation' => 'Josei manga books'],

            ['key' => 'subcat_name manga_kodomo', 'language' => 'es', 'translation' => 'Manga kodomo'],
            ['key' => 'subcat_name manga_kodomo', 'language' => 'en', 'translation' => 'Kodomo manga'],
            ['key' => 'subcat_desc manga_kodomo', 'language' => 'es', 'translation' => 'Manga kodomo'],
            ['key' => 'subcat_desc manga_kodomo', 'language' => 'en', 'translation' => 'Kodomo manga books'],

            ['key' => 'subcat_name manga_yaoi', 'language' => 'es', 'translation' => 'Manga yaoi'],
            ['key' => 'subcat_name manga_yaoi', 'language' => 'en', 'translation' => 'Yaoi manga'],
            ['key' => 'subcat_desc manga_yaoi', 'language' => 'es', 'translation' => 'Manga yaoi'],
            ['key' => 'subcat_desc manga_yaoi', 'language' => 'en', 'translation' => 'Yaoi manga books'],

            ['key' => 'subcat_name manga_yuri', 'language' => 'es', 'translation' => 'Manga yuri'],
            ['key' => 'subcat_name manga_yuri', 'language' => 'en', 'translation' => 'Yuri manga'],
            ['key' => 'subcat_desc manga_yuri', 'language' => 'es', 'translation' => 'Manga yuri'],
            ['key' => 'subcat_desc manga_yuri', 'language' => 'en', 'translation' => 'Yuri manga books'],

            ['key' => 'subcat_name manga_hentai', 'language' => 'es', 'translation' => 'Manga hentai'],
            ['key' => 'subcat_name manga_hentai', 'language' => 'en', 'translation' => 'Hentai manga'],
            ['key' => 'subcat_desc manga_hentai', 'language' => 'es', 'translation' => 'Manga hentai'],
            ['key' => 'subcat_desc manga_hentai', 'language' => 'en', 'translation' => 'Hentai manga books'],

            ['key' => 'subcat_name manga_doujinshi', 'language' => 'es', 'translation' => 'Manga doujinshi'],
            ['key' => 'subcat_name manga_doujinshi', 'language' => 'en', 'translation' => 'Doujinshi manga'],
            ['key' => 'subcat_desc manga_doujinshi', 'language' => 'es', 'translation' => 'Manga doujinshi'],
            ['key' => 'subcat_desc manga_doujinshi', 'language' => 'en', 'translation' => 'Doujinshi manga books'],

            ['key' => 'subcat_name manga_baras', 'language' => 'es', 'translation' => 'Manga baras'],
            ['key' => 'subcat_name manga_baras', 'language' => 'en', 'translation' => 'Baras manga'],
            ['key' => 'subcat_desc manga_baras', 'language' => 'es', 'translation' => 'Manga baras'],
            ['key' => 'subcat_desc manga_baras', 'language' => 'en', 'translation' => 'Baras manga books'],

        ];

        foreach ($translations as $translation) {
            Translation::create($translation);
        }
    }
}
