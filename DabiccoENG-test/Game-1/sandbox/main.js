    /***************************************
     * GLOBAL CONSTANTS & ARRAYS
     ***************************************/
    const GRID_SIZE         = 50;
    const EMPTY             = 0;
    const ERASER            = 5;

    // Basic elements
    const SAND              = 1;
    const WALL              = 44;
    const WATER             = 2;
    const LAVA              = 3;
    const STONE             = 4;
    const WATER_VAPOR       = 6;
    const CLOUD             = 7;
    const BASALT            = 8;
    const OBSIDIAN          = 9;
    const MOLTEN_SLAG       = 10;
    const COPPER            = 11;
    const STEEL             = 12;
    const ICE               = 13;
    const WOOD              = 14;
    const FIRE              = 15;
    const SMOKE             = 16;
    const BURNING_WOOD      = 17;
    const ASH               = 18;
    const GLASS             = 19;
    const BOMB              = 20;

    // Additional
    const DIRT              = 21;
    const WET_DIRT          = 22;
    const WHEAT_SEEDS       = 23;
    const WHEAT             = 24;
    const FLOUR             = 25;
    const DOUGH             = 26;
    const BREAD             = 27;
    const ROOT              = 28;
    const BURNING_ORGANIC   = 29;
    const SPARK             = 30;
    const CHARGED_COPPER    = 31;
    const OAK_SEEDS         = 32;
    const OAK_LEAVES        = 33;
    const OAK_BABY_LEAVES   = 34;
    const DEAD_OAK          = 35;
    const WET_SAND          = 36;
    const GRASS             = 37;
    const DEAD_PLANT        = 38;
    const BURNING_LEAVES    = 39;
    const BURNING_ROOT      = 40;
    const DEAD_ROOT         = 41;
    const GAS               = 42;
    const BURNING_GAS       = 43;
    const CHARGED_DOWN_COPPER = 45;

    // COOLER & HEATER
    const COOLER            = 46;
    const HEATER            = 47;

    // NEW Electric elements
    const HEAT_SEPARATOR                = 48;
    const CHARGED_HEAT_SEPARATOR        = 49;
    const CHARGED_DOWN_HEAT_SEPARATOR   = 50;

    const INPUT                         = 51;
    const CHARGED_INPUT                 = 52;

    const OUTPUT                        = 53;
    const CHARGED_OUTPUT                = 54;

    const NOT_GATE                      = 55;
    const AND_GATE                      = 56;
    const BLOCKER                       = 57;

    // Simulation constants
    let speed               = 0.1;
    const simulationTimeStep= 0.1;
    const vaporTransformThreshold= 4;
    const diffusionRate     = 0.3;
    const fireTemperature   = 600;
    const burnDuration      = 1.5;
    const burnToAshChance   = 0.25;
    const fireLifetime      = 2.0;
    const glassTemp         = 1700;
    const bombExplosionRadius= 3;
    const wetDirtEvapTemp   = 100;
    const doughBakeTemp     = 120;
    const breadBurnTemp     = 1000;
    const sparkLifetime     = 0.5;
    const burningGasDuration= 2.0;

    // conduction & heat capacity
    const conductionRates={
      [EMPTY]:0,[SAND]:0.2,[WALL]:0,
      [WATER]:0.9,[LAVA]:0.4,[STONE]:0.05,
      [ERASER]:0,[WATER_VAPOR]:0.6,[CLOUD]:0.3,[BASALT]:0.05,[OBSIDIAN]:0.02,
      [MOLTEN_SLAG]:0.3,[COPPER]:2.0,[STEEL]:0.8,[ICE]:0.3,[WOOD]:0.3,
      [FIRE]:1.0,[SMOKE]:0.3,[BURNING_WOOD]:0.3,[ASH]:0.01,[GLASS]:0.1,
      [BOMB]:0.05,[DIRT]:0.1,[WET_DIRT]:0.15,[WHEAT_SEEDS]:0.05,[WHEAT]:0.05,
      [FLOUR]:0.1,[DOUGH]:0.1,[BREAD]:0.05,[ROOT]:0.1,[BURNING_ORGANIC]:0.3,
      [SPARK]:0.05,[CHARGED_COPPER]:0.05,[OAK_SEEDS]:0.05,[OAK_LEAVES]:0.05,
      [OAK_BABY_LEAVES]:0.05,[DEAD_OAK]:0.05,[WET_SAND]:0.2,[GRASS]:0.1,
      [DEAD_PLANT]:0.05,[BURNING_LEAVES]:0.3,[BURNING_ROOT]:0.3,[DEAD_ROOT]:0.1,
      [GAS]:0.05,[BURNING_GAS]:0.1,[CHARGED_DOWN_COPPER]:0.05,
      [COOLER]:0.2,[HEATER]:0.2,

      // New electric elements
      [HEAT_SEPARATOR]:0.2,
      [CHARGED_HEAT_SEPARATOR]:0.2,
      [CHARGED_DOWN_HEAT_SEPARATOR]:0.2,

      [INPUT]:0.1,[CHARGED_INPUT]:0.1,
      [OUTPUT]:0.1,[CHARGED_OUTPUT]:0.1,
      [NOT_GATE]:0.1,[AND_GATE]:0.1,
      [BLOCKER]:0.1
    };

    const heatCapacities={
      [EMPTY]:1,[SAND]:1,[WALL]:1,
      [WATER]:1,[LAVA]:1.5,[STONE]:2,
      [ERASER]:1,[WATER_VAPOR]:0.5,[CLOUD]:0.5,[BASALT]:2,[OBSIDIAN]:3,
      [MOLTEN_SLAG]:1.5,[COPPER]:5,[STEEL]:4,[ICE]:2,[WOOD]:1,
      [FIRE]:0.1,[SMOKE]:0.2,[BURNING_WOOD]:1,[ASH]:2,[GLASS]:1,
      [BOMB]:1,[DIRT]:1,[WET_DIRT]:1,[WHEAT_SEEDS]:0.5,[WHEAT]:2,
      [FLOUR]:0.5,[DOUGH]:1,[BREAD]:1,[ROOT]:1,[BURNING_ORGANIC]:0.8,
      [SPARK]:0.1,[CHARGED_COPPER]:0.1,[OAK_SEEDS]:0.5,[OAK_LEAVES]:0.5,
      [OAK_BABY_LEAVES]:0.5,[DEAD_OAK]:0.5,[WET_SAND]:1,[GRASS]:1,
      [DEAD_PLANT]:2,[BURNING_LEAVES]:1,[BURNING_ROOT]:1,[DEAD_ROOT]:2,
      [GAS]:0.5,[BURNING_GAS]:0.3,[CHARGED_DOWN_COPPER]:0.1,
      [COOLER]:10,[HEATER]:10,

      // new electric
      [HEAT_SEPARATOR]:2,
      [CHARGED_HEAT_SEPARATOR]:2,
      [CHARGED_DOWN_HEAT_SEPARATOR]:2,

      [INPUT]:1,
      [CHARGED_INPUT]:1,
      [OUTPUT]:1,
      [CHARGED_OUTPUT]:1,
      [NOT_GATE]:1,
      [AND_GATE]:1,
      [BLOCKER]:1
    };

    // grid data
    let grid=[], temp=[], moved=[];

    // Timers
    let vaporLife=[], cloudLife=[];
    let fireLife=[], smokeLife=[];
    let burningWoodTime=[];

    // wheat
    let wheatHeight=[], wheatMaxHeight=[], seedGrowthTime=[], rootLife=[];

    // spark
    let sparkLife=[], sparkTimer=[];

    // smoke & cloud
    let smokeMaxLife=[], cloudMaxLife=[];

    // oak trees
    let oakTreeGrowthTime=[], oakTreeHeight=[], oakTreeMaxHeight=[];
    let oakTreeRootTimer=[], oakTreeRootDepth=[], oakTreeRootMax=[];
    let branchLevel=[], branchLen=[], branchMaxArr=[], branchSubCount=[];
    let branchDirX=[], branchDirY=[];

    // grass
    let grassStage=[];

    // burning gas
    let burningGasTime=[];

    // charge timers
    let chargedStateTime=[];

    for(let y=0;y<GRID_SIZE;y++){
      let row=[], trow=[], mrow=[];
      let vrow=[], crow=[], frow=[], srow=[], bwrow=[];
      let wH=[], wMH=[], sGT=[], rLifeRow=[];
      let spLifeRow=[], spTimerRow=[];
      let smaxrow=[], cmaxrow=[];
      let bLevel=[], bLen=[], bMax=[], bSub=[], bDirXrow=[], bDirYrow=[];
      let otGrowth=[], otHeight=[], otMaxHeight=[];
      let otRootTimer=[], otRootDepth=[], otRootMax=[];
      let grassRow=[];
      let burnGasRow=[];
      let cdtRow=[];

      for(let x=0;x<GRID_SIZE;x++){
        row.push(EMPTY);
        trow.push(null);
        mrow.push(false);

        vrow.push(0);
        crow.push(0);
        frow.push(0);
        srow.push(0);
        bwrow.push(0);

        wH.push(0);
        wMH.push(0);
        sGT.push(0);
        rLifeRow.push(0);

        spLifeRow.push(0);
        spTimerRow.push(0);

        smaxrow.push(1.0+2.0*Math.random());
        cmaxrow.push(5.0+5.0*Math.random());

        bLevel.push(-1);
        bLen.push(0);
        bMax.push(0);
        bSub.push(-1);
        bDirXrow.push(0);
        bDirYrow.push(0);

        otGrowth.push(0);
        otHeight.push(0);
        otMaxHeight.push(0);
        otRootTimer.push(0);
        otRootDepth.push(0);
        otRootMax.push(0);

        grassRow.push(1);
        burnGasRow.push(0);

        cdtRow.push(0);
      }
      grid.push(row);
      temp.push(trow);
      moved.push(mrow);

      vaporLife.push(vrow);
      cloudLife.push(crow);
      fireLife.push(frow);
      smokeLife.push(srow);
      burningWoodTime.push(bwrow);

      wheatHeight.push(wH);
      wheatMaxHeight.push(wMH);
      seedGrowthTime.push(sGT);
      rootLife.push(rLifeRow);

      sparkLife.push(spLifeRow);
      sparkTimer.push(spTimerRow);

      smokeMaxLife.push(smaxrow);
      cloudMaxLife.push(cmaxrow);

      branchLevel.push(bLevel);
      branchLen.push(bLen);
      branchMaxArr.push(bMax);
      branchSubCount.push(bSub);
      branchDirX.push(bDirXrow);
      branchDirY.push(bDirYrow);

      oakTreeGrowthTime.push(otGrowth);
      oakTreeHeight.push(otHeight);
      oakTreeMaxHeight.push(otMaxHeight);
      oakTreeRootTimer.push(otRootTimer);
      oakTreeRootDepth.push(otRootDepth);
      oakTreeRootMax.push(otRootMax);

      grassStage.push(grassRow);
      burningGasTime.push(burnGasRow);

      chargedStateTime.push(cdtRow);
    }

    /***************************************
     * DOM
     ***************************************/
    const gridContainer  = document.getElementById('grid');
    const toolElements   = document.getElementsByClassName('tool');
    const speedSlider    = document.getElementById('speed');
    const speedValueDisplay = document.getElementById('speedValue');
    const clearAllBtn    = document.getElementById('clearAllBtn');
    const hudTemp        = document.getElementById('hudTemp');
    const hudElem        = document.getElementById('hudElem');
    const hudFPS         = document.getElementById('hudFPS');
    const toolSearch     = document.getElementById('toolSearch');
    const toolbar        = document.getElementById('toolbar');

    // CATEGORY DOM
    const categoryButtons = document.querySelectorAll('#categoryButtons button');

    let activeCategory = 'all'; // default

    const cells = [];
    for(let y=0;y<GRID_SIZE;y++){
      let rowOfCells = [];
      for(let x=0;x<GRID_SIZE;x++){
        const cell=document.createElement('div');
        cell.classList.add('cell');
        cell.id=cell-${x}-${y};
        gridContainer.appendChild(cell);
        rowOfCells.push(cell);
      }
      cells.push(rowOfCells);
    }

    let currentTool=SAND;

    function selectTool(el){
      Array.from(toolElements).forEach(t=>t.classList.remove('selected'));
      el.classList.add('selected');
      const name=el.getAttribute('data-tool');
      switch(name){
        case "eraser": currentTool=ERASER;  break;
        case "sand":   currentTool=SAND;    break;
        case "wall":   currentTool=WALL;    break;
        case "water":  currentTool=WATER;   break;
        case "lava":   currentTool=LAVA;    break;
        case "stone":  currentTool=STONE;   break;
        case "water-vapor": currentTool=WATER_VAPOR; break;
        case "copper": currentTool=COPPER;  break;
        case "steel":  currentTool=STEEL;   break;
        case "ice":    currentTool=ICE;     break;
        case "wood":   currentTool=WOOD;    break;
        case "fire":   currentTool=FIRE;    break;
        case "smoke":  currentTool=SMOKE;   break;
        case "ash":    currentTool=ASH;     break;
        case "glass":  currentTool=GLASS;   break;
        case "bomb":   currentTool=BOMB;    break;
        case "dirt":   currentTool=DIRT;    break;
        case "wet-dirt": currentTool=WET_DIRT; break;
        case "wheat-seeds": currentTool=WHEAT_SEEDS; break;
        case "flour":  currentTool=FLOUR;   break;
        case "dough":  currentTool=DOUGH;   break;
        case "bread":  currentTool=BREAD;   break;
        case "plant-root": currentTool=ROOT; break;
        case "spark":  currentTool=SPARK;   break;
        case "oak-seeds": currentTool=OAK_SEEDS; break;
        case "grass":  currentTool=GRASS;   break;
        case "gas":    currentTool=GAS;     break;
        case "cooler": currentTool=COOLER;  break;
        case "heater": currentTool=HEATER;  break;

        // new electric
        case "heat-separator": currentTool=HEAT_SEPARATOR; break;
        case "input": currentTool=INPUT; break;
        case "output": currentTool=OUTPUT; break;
        case "not-gate": currentTool=NOT_GATE; break;
        case "and-gate": currentTool=AND_GATE; break;
        case "blocker": currentTool=BLOCKER; break;
      }
    }
    Array.from(toolElements).forEach(el=>{
      el.addEventListener('click',()=>selectTool(el));
    });

    speedSlider.addEventListener('input', e=>{
      speed=parseFloat(e.target.value);
      speedValueDisplay.textContent=speed.toFixed(2);
    });

    clearAllBtn.addEventListener('click',()=>{
      for(let y=0;y<GRID_SIZE;y++){
        for(let x=0;x<GRID_SIZE;x++){
          eraseCell(x,y);
        }
      }
    });

    // Mouse handling
    let isLeftMouseDown=false, isRightMouseDown=false;
    let hoveredX=null, hoveredY=null;

    function onMouseDown(e){
      e.preventDefault();
      if(e.button===0) isLeftMouseDown=true;
      else if(e.button===2) isRightMouseDown=true;
    }
    function onMouseUp(e){
      e.preventDefault();
      if(e.button===0) isLeftMouseDown=false;
      else if(e.button===2) isRightMouseDown=false;
    }
    gridContainer.addEventListener('mousedown',onMouseDown);
    gridContainer.addEventListener('mouseup',onMouseUp);
    gridContainer.addEventListener('contextmenu', e=>e.preventDefault());
    gridContainer.addEventListener('mouseleave',()=>{
      isLeftMouseDown=false;
      isRightMouseDown=false;
      hoveredX=null; hoveredY=null;
      hudTemp.textContent="Temp: -- °C";
      hudElem.textContent="Element: --";
      hudFPS.textContent="FPS: --";
    });
    gridContainer.addEventListener('mousemove', e=>{
      const {x,y}=getMousePos(e);
      hoveredX=x; hoveredY=y;
    });

    function getMousePos(e){
      const rect=gridContainer.getBoundingClientRect();
      const cellSize=rect.width/GRID_SIZE;
      let px=Math.floor((e.clientX-rect.left)/cellSize);
      let py=Math.floor((e.clientY-rect.top)/cellSize);
      return {
        x: Math.max(0,Math.min(GRID_SIZE-1,px)),
        y: Math.max(0,Math.min(GRID_SIZE-1,py))
      };
    }

    function spamPlace(){
      if(hoveredX===null||hoveredY===null) return;
      if(isLeftMouseDown){
        placeElementAt(hoveredX, hoveredY, currentTool);
      } else if(isRightMouseDown){
        placeElementAt(hoveredX, hoveredY, ERASER);
      }
    }

    /***************************************
     * PLACEMENT & ERASURE
     ***************************************/
    function placeElementAt(x,y,tool){
      if(x<0||x>=GRID_SIZE||y<0||y>=GRID_SIZE) return;
      if(grid[y][x]===tool) return;
      if(tool===ERASER){
        eraseCell(x,y);
        return;
      }

      eraseCell(x,y);

      grid[y][x]=tool;
      switch(tool){
        case SAND:      temp[y][x]=20;    break;
        case WALL:      temp[y][x]=20;    break;
        case WATER:     temp[y][x]=20;    break;
        case LAVA:      temp[y][x]=1200;  break;
        case STONE:     temp[y][x]=20;    break;
        case WATER_VAPOR:
          temp[y][x]=120; 
          vaporLife[y][x]=0; 
          break;
        case COPPER:    temp[y][x]=100;   break;
        case STEEL:     temp[y][x]=50;    break;
        case ICE:       temp[y][x]=-5;    break;
        case WOOD:
          temp[y][x]=20;
          burningWoodTime[y][x]=0; 
          break;
        case FIRE:
          temp[y][x]=fireTemperature;
          fireLife[y][x]=0;
          break;
        case SMOKE:
          temp[y][x]=80;
          smokeLife[y][x]=0;
          smokeMaxLife[y][x]=1+2*Math.random();
          break;
        case ASH:       temp[y][x]=20;    break;
        case GLASS:     temp[y][x]=300;   break;
        case BOMB:      temp[y][x]=20;    break;
        case DIRT:      temp[y][x]=20;    break;
        case WET_DIRT:  temp[y][x]=20;    break;
        case WHEAT_SEEDS:
          temp[y][x]=20;
          seedGrowthTime[y][x]=0;
          break;
        case FLOUR:     temp[y][x]=20;    break;
        case DOUGH:     temp[y][x]=25;    break;
        case BREAD:     temp[y][x]=30;    break;
        case ROOT:
          temp[y][x]=15;
          break;
        case BURNING_ORGANIC:
          temp[y][x]=fireTemperature;
          break;
        case SPARK:
          temp[y][x]=20;
          sparkLife[y][x]=0; 
          break;
        case OAK_SEEDS:
          temp[y][x]=20;
          oakTreeGrowthTime[y][x]=0;
          break;
        case GRASS:
          temp[y][x]=20;
          grassStage[y][x]=1;
          break;
        case GAS:
          temp[y][x]=20;
          break;
        case CHARGED_COPPER:
          temp[y][x]=150;
          chargedStateTime[y][x]=0;
          break;
        case CHARGED_DOWN_COPPER:
          temp[y][x]=150;
          chargedStateTime[y][x]=0;
          break;
        case COOLER:
          temp[y][x]=20;
          break;
        case HEATER:
          temp[y][x]=20;
          break;

        // new electrics:
        case HEAT_SEPARATOR:
          temp[y][x]=20;
          break;
        case CHARGED_HEAT_SEPARATOR:
          temp[y][x]=20;
          chargedStateTime[y][x]=0;
          break;
        case CHARGED_DOWN_HEAT_SEPARATOR:
          temp[y][x]=20;
          chargedStateTime[y][x]=0;
          break;
        case INPUT:
          temp[y][x]=20;
          break;
        case CHARGED_INPUT:
          temp[y][x]=20;
          chargedStateTime[y][x]=0;
          break;
        case OUTPUT:
          temp[y][x]=20;
          break;
        case CHARGED_OUTPUT:
          temp[y][x]=20;
          chargedStateTime[y][x]=0;
          break;
        case NOT_GATE:
        case AND_GATE:
        case BLOCKER:
          temp[y][x]=20;
          break;
      }
    }

    function eraseCell(x,y){
      if(x<0||x>=GRID_SIZE||y<0||y>=GRID_SIZE) return;
      grid[y][x]=EMPTY;
      temp[y][x]=null;
      moved[y][x]=false;

      vaporLife[y][x]=0; 
      cloudLife[y][x]=0; 
      fireLife[y][x]=0; 
      smokeLife[y][x]=0; 
      burningWoodTime[y][x]=0;
      wheatHeight[y][x]=0;
      wheatMaxHeight[y][x]=0;
      seedGrowthTime[y][x]=0;
      rootLife[y][x]=0;

      sparkLife[y][x]=0;
      sparkTimer[y][x]=0;

      oakTreeGrowthTime[y][x]=0;
      oakTreeHeight[y][x]=0;
      oakTreeMaxHeight[y][x]=0;
      oakTreeRootTimer[y][x]=0;
      oakTreeRootDepth[y][x]=0;
      oakTreeRootMax[y][x]=0;
      branchLevel[y][x]=-1;
      branchLen[y][x]=0;
      branchMaxArr[y][x]=0;
      branchSubCount[y][x]=-1;
      branchDirX[y][x]=0;
      branchDirY[y][x]=0;
      grassStage[y][x]=1;
      burningGasTime[y][x]=0;

      chargedStateTime[y][x]=0;
    }

    /***************************************
     * RENDER & HUD
     ***************************************/
    function renderCell(x,y){
      const cell = cells[y][x];
      cell.className='cell';
      cell.style.opacity="";

      const e=grid[y][x];
      switch(e){
        case SAND: cell.classList.add('sand'); break;
        case WALL: cell.classList.add('wall'); break;
        case WATER: cell.classList.add('water'); break;
        case LAVA: cell.classList.add('lava'); break;
        case STONE: cell.classList.add('stone'); break;
        case WATER_VAPOR: cell.classList.add('water-vapor'); break;
        case CLOUD: cell.classList.add('cloud'); break;
        case BASALT:
        case OBSIDIAN: cell.classList.add('stone'); break;
        case MOLTEN_SLAG: cell.classList.add('lava'); break;
        case COPPER: cell.classList.add('copper'); break;
        case STEEL: cell.classList.add('steel'); break;
        case ICE: cell.classList.add('ice'); break;
        case WOOD: cell.classList.add('wood'); break;
        case FIRE: cell.classList.add('fire'); break;
        case SMOKE:{
          cell.classList.add('smoke');
          let max=smokeMaxLife[y][x];
          let life=smokeLife[y][x];
          let ratio=1-(life/max);
          if(ratio<0) ratio=0;
          cell.style.opacity=ratio.toString();
        } break;
        case BURNING_WOOD: cell.classList.add('burning-wood'); break;
        case BURNING_ORGANIC: cell.classList.add('burning-organic'); break;
        case ASH: cell.classList.add('ash'); break;
        case GLASS: cell.classList.add('glass'); break;
        case BOMB: cell.classList.add('bomb'); break;
        case DIRT: cell.classList.add('dirt'); break;
        case WET_DIRT: cell.classList.add('wet-dirt'); break;
        case WHEAT_SEEDS: cell.classList.add('wheat-seeds'); break;
        case WHEAT: cell.classList.add('wheat'); break;
        case FLOUR: cell.classList.add('flour'); break;
        case DOUGH: cell.classList.add('dough'); break;
        case BREAD: cell.classList.add('bread'); break;
        case ROOT: cell.classList.add('root'); break;
        case BURNING_ROOT: cell.classList.add('burning-root'); break;
        case DEAD_ROOT: cell.classList.add('dead-root'); break;
        case SPARK: cell.classList.add('spark'); break;
        case CHARGED_COPPER: cell.classList.add('charged-copper'); break;
        case CHARGED_DOWN_COPPER: cell.classList.add('charged-down-copper'); break;
        case OAK_SEEDS: cell.classList.add('oak-seeds'); break;
        case OAK_LEAVES: cell.classList.add('oak-leaves'); break;
        case OAK_BABY_LEAVES: cell.classList.add('oak-baby-leaves'); break;
        case DEAD_OAK: cell.classList.add('dead-oak'); break;
        case WET_SAND: cell.classList.add('wet-sand'); break;
        case GRASS: cell.classList.add('grass'); break;
        case DEAD_PLANT: cell.classList.add('dead-plant'); break;
        case BURNING_LEAVES: cell.classList.add('burning-leaves'); break;
        case GAS: cell.classList.add('gas'); break;
        case BURNING_GAS: cell.classList.add('burning-gas'); break;
        case COOLER: cell.classList.add('cooler'); break;
        case HEATER: cell.classList.add('heater'); break;

        // new electric
        case HEAT_SEPARATOR: cell.classList.add('heat-separator'); break;
        case CHARGED_HEAT_SEPARATOR: cell.classList.add('charged-heat-separator'); break;
        case CHARGED_DOWN_HEAT_SEPARATOR: cell.classList.add('charged-down-heat-separator'); break;
        case INPUT: cell.classList.add('input'); break;
        case CHARGED_INPUT: cell.classList.add('charged-input'); break;
        case OUTPUT: cell.classList.add('output'); break;
        case CHARGED_OUTPUT: cell.classList.add('charged-output'); break;
        case NOT_GATE: cell.classList.add('not-gate'); break;
        case AND_GATE: cell.classList.add('and-gate'); break;
        case BLOCKER: cell.classList.add('blocker'); break;

        default: break;
      }
    }

    function renderGrid(){
      for(let y=0;y<GRID_SIZE;y++){
        for(let x=0;x<GRID_SIZE;x++){
          renderCell(x,y);
        }
      }
    }

    function updateHUD(){
      if(hoveredX!==null && hoveredY!==null){
        let t=temp[hoveredY][hoveredX];
        let displayT=(t===null)?"--":t.toFixed(1);
        hudTemp.textContent=Temp: ${displayT} °C;
        hudElem.textContent=Element: ${getElementName(grid[hoveredY][hoveredX])};
      }
    }
    function getElementName(e){
      switch(e){
        case EMPTY: return "Empty";
        case SAND: return "Sand";
        case WALL: return "Wall";
        case WATER: return "Water";
        case LAVA: return "Lava";
        case STONE: return "Stone";
        case ERASER: return "Eraser";
        case WATER_VAPOR: return "Water Vapor";
        case CLOUD: return "Cloud";
        case BASALT: return "Basalt";
        case OBSIDIAN: return "Obsidian";
        case MOLTEN_SLAG: return "Molten Slag";
        case COPPER: return "Copper";
        case STEEL: return "Steel";
        case ICE: return "Ice";
        case WOOD: return "Wood";
        case FIRE: return "Fire";
        case SMOKE: return "Smoke";
        case BURNING_WOOD: return "Burning Wood";
        case BURNING_ORGANIC: return "Burning Organic";
        case ASH: return "Ash";
        case GLASS: return "Glass";
        case BOMB: return "Bomb";
        case DIRT: return "Dirt";
        case WET_DIRT: return "Wet Dirt";
        case WHEAT_SEEDS: return "Wheat Seeds";
        case WHEAT: return "Wheat";
        case FLOUR: return "Flour";
        case DOUGH: return "Dough";
        case BREAD: return "Bread";
        case ROOT: return "Plant Root";
        case BURNING_ROOT: return "Burning Root";
        case DEAD_ROOT: return "Dead Root";
        case SPARK: return "Spark";
        case CHARGED_COPPER: return "Charged Copper";
        case CHARGED_DOWN_COPPER: return "Charged-Down Copper";
        case OAK_SEEDS: return "Oak Tree Seeds";
        case OAK_LEAVES: return "Oak Tree Leaves";
        case OAK_BABY_LEAVES: return "Baby Oak Leaves";
        case DEAD_OAK: return "Dead Oak";
        case WET_SAND: return "Wet Sand";
        case GRASS: return "Grass";
        case DEAD_PLANT: return "Dead Plant";
        case BURNING_LEAVES: return "Burning Leaves";
        case GAS: return "Gas";
        case BURNING_GAS: return "Burning Gas";
        case COOLER: return "Cooler";
        case HEATER: return "Heater";

        // new electric
        case HEAT_SEPARATOR: return "Heat Separator";
        case CHARGED_HEAT_SEPARATOR: return "Charged Heat Separator";
        case CHARGED_DOWN_HEAT_SEPARATOR: return "Charged-Down Heat Separator";
        case INPUT: return "Input";
        case CHARGED_INPUT: return "Charged Input";
        case OUTPUT: return "Output";
        case CHARGED_OUTPUT: return "Charged Output";
        case NOT_GATE: return "Not Gate";
        case AND_GATE: return "And Gate";
        case BLOCKER: return "Blocker";
      }
      return "Unknown";
    }

    function resetMoved(){
      for(let y=0;y<GRID_SIZE;y++){
        for(let x=0;x<GRID_SIZE;x++){
          moved[y][x]=false;
        }
      }
    }

    /***************************************
     * GAME LOOP
     ***************************************/
    let stepAccumulator=0;
    let lastTime=performance.now();
    let frames=0,fps=0;
    function gameLoop(){
      frames++;
      const now=performance.now();
      if(now-lastTime>=1000){
        fps=frames;
        frames=0;
        lastTime=now;
      }
      hudFPS.textContent=FPS: ${fps};
      spamPlace();
      if(speed>0){
        stepAccumulator+=speed;
        while(stepAccumulator>=1){
          resetMoved();
          performSimulationStep();
          updateTemperature();
          unifyCopperClusters();
          processTransformations();
          stepAccumulator-=1;
        }
      }
      updateHUD();
      renderGrid();
      requestAnimationFrame(gameLoop);
    }
    requestAnimationFrame(gameLoop);

    /***************************************
     * SIMULATION STEP
     ***************************************/
    function performSimulationStep(){
      let yPositions=[];
      for(let i=0;i<GRID_SIZE;i++) yPositions.push(i);
      shuffle(yPositions);

      for(let i=yPositions.length-1;i>=0;i--){
        let y=yPositions[i];
        let xPositions=[];
        for(let j=0;j<GRID_SIZE;j++) xPositions.push(j);
        shuffle(xPositions);

        for(let j=0;j<xPositions.length;j++){
          let x=xPositions[j];
          if(moved[y][x]) continue;
          let e=grid[y][x];

          if(e===WALL) continue;

          // SPARK => update timer, can detonate bombs, can charge copper
          if(e===SPARK){
            sparkLife[y][x]+=simulationTimeStep;
            if(sparkLife[y][x]>=sparkLifetime){
              eraseCell(x,y);
              continue;
            }
            let neighbors=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
            for(let [dx,dy] of neighbors){
              let nx=x+dx, ny=y+dy;
              if(nx>=0&&nx<GRID_SIZE&&ny>=0&&ny<GRID_SIZE){
                if(grid[ny][nx]===BOMB){
                  explodeBomb(nx,ny);
                }
                // only charge copper if temp < 300
                if(grid[ny][nx]===COPPER && temp[ny][nx]<300){
                  grid[ny][nx]=CHARGED_COPPER;
                  // slightly heat the copper
                  temp[ny][nx]=Math.min(temp[ny][nx]+50, 1200);
                  chargedStateTime[ny][nx]=0;
                }
              }
            }
            continue;
          }

          // powders + grass
          if(e===SAND|| e===ASH|| e===BOMB|| e===DIRT|| e===WET_DIRT|| e===WHEAT_SEEDS|| e===FLOUR|| e===DEAD_PLANT|| e===GRASS){
            moveLikePowder(x,y,temp[y][x],e);
            continue;
          }
          // wet sand
          if(e===WET_SAND){
            moveWET_SAND(x,y,temp[y][x],e);
            continue;
          }
          // dough/bread
          if(e===DOUGH|| e===BREAD){
            moveDoughBread(x,y,temp[y][x],e);
            continue;
          }
          // water/lava => liquids
          if(e===WATER){
            moveLikeLiquid(x,y,temp[y][x],WATER);
            continue;
          }
          if(e===LAVA){
            if(Math.random()<0.5) continue;
            moveLikeLiquid(x,y,temp[y][x],LAVA);
            continue;
          }
          // vapor => float up
          if(e===WATER_VAPOR){
            vaporLife[y][x]+=simulationTimeStep;
            moveVaporUp(x,y,temp[y][x]);
            continue;
          }
          if(e===CLOUD){
            cloudLife[y][x]+=simulationTimeStep;
            moveCloud(x,y,temp[y][x]);
            continue;
          }
          if(e===FIRE){
            fireLife[y][x]+=simulationTimeStep;
            moveFire(x,y,temp[y][x]);
            continue;
          }
          if(e===SMOKE){
            smokeLife[y][x]+=simulationTimeStep;
            moveSmoke(x,y,temp[y][x]);
            continue;
          }
          if(e===GAS|| e===BURNING_GAS){
            moveGasElement(x,y,temp[y][x],e);
            continue;
          }
        }
      }
    }

    /***************************************
     * HELPER: shuffle
     ***************************************/
    function shuffle(array){
      for(let i=array.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        [array[i],array[j]]=[array[j],array[i]];
      }
      return array;
    }

    /***************************************
     * MOVEMENT
     ***************************************/
    function moveCell(x,y,nx,ny,oldT,newElem){
      if(nx<0||nx>=GRID_SIZE||ny<0||ny>=GRID_SIZE) return;
      grid[ny][nx]=newElem;
      temp[ny][nx]=oldT;
      grid[y][x]=EMPTY;
      temp[y][x]=null;
      moved[ny][nx]=true;

      // Transfer timers
      if(newElem===WATER_VAPOR){
        vaporLife[ny][nx]=vaporLife[y][x]; 
        vaporLife[y][x]=0;
      }
      if(newElem===CLOUD){
        cloudLife[ny][nx]=cloudLife[y][x];
        cloudLife[y][x]=0;
        cloudMaxLife[ny][nx]=cloudMaxLife[y][x];
      }
      if(newElem===FIRE){
        fireLife[ny][nx]=fireLife[y][x];
        fireLife[y][x]=0;
      }
      if(newElem===SMOKE){
        smokeLife[ny][nx]=smokeLife[y][x];
        smokeLife[y][x]=0;
        smokeMaxLife[ny][nx]=smokeMaxLife[y][x];
      }
      if(newElem===BURNING_WOOD||newElem===BURNING_ORGANIC||newElem===BURNING_ROOT){
        burningWoodTime[ny][nx]=burningWoodTime[y][x];
        burningWoodTime[y][x]=0;
      }
      if(newElem===WHEAT_SEEDS){
        seedGrowthTime[ny][nx]=seedGrowthTime[y][x];
        seedGrowthTime[y][x]=0;
      }
      if(newElem===WHEAT){
        wheatHeight[ny][nx]=wheatHeight[y][x];
        wheatMaxHeight[ny][nx]=wheatMaxHeight[y][x];
        wheatHeight[y][x]=0;
        wheatMaxHeight[y][x]=0;
      }
      if(newElem===GAS||newElem===BURNING_GAS){
        burningGasTime[ny][nx]=burningGasTime[y][x];
        burningGasTime[y][x]=0;
      }
      if(newElem===GRASS){
        grassStage[ny][nx]=grassStage[y][x];
      }
      if(newElem===SPARK){
        sparkLife[ny][nx]=sparkLife[y][x];
        sparkTimer[ny][nx]=sparkTimer[y][x];
        sparkLife[y][x]=0;
        sparkTimer[y][x]=0;
      }
      // If it's a 'charged' variant, copy over the charged timer
      if(
        newElem===CHARGED_COPPER|| newElem===CHARGED_DOWN_COPPER||
        newElem===CHARGED_HEAT_SEPARATOR|| newElem===CHARGED_DOWN_HEAT_SEPARATOR||
        newElem===CHARGED_INPUT|| newElem===CHARGED_OUTPUT
      ){
        chargedStateTime[ny][nx]=chargedStateTime[y][x];
        chargedStateTime[y][x]=0;
      }
    }

    function moveLikePowder(x,y,oldT,elem){
      if(y+1<GRID_SIZE && grid[y+1][x]===EMPTY && !moved[y+1][x]){
        moveCell(x,y,x,y+1,oldT,elem);
      }
      else if(y+1<GRID_SIZE && grid[y+1][x]===WATER && !moved[y+1][x]){
        let dirs=shuffle([-1,1]);
        let pushed=false;
        for(let dir of dirs){
          let nx=x+dir, ny=y+1;
          if(nx>=0&&nx<GRID_SIZE&&ny<GRID_SIZE&&grid[ny][nx]===EMPTY&&!moved[ny][nx]){
            grid[ny][nx]=WATER;
            temp[ny][nx]=temp[y+1][x];
            grid[y+1][x]=elem;
            temp[y+1][x]=oldT;
            grid[y][x]=EMPTY;
            temp[y][x]=null;
            moved[ny][nx]=true;
            pushed=true;
            break;
          }
        }
        if(!pushed){
          let diag=shuffle([-1,1]);
          for(let d of diag){
            let nx=x+d, ny=y+1;
            if(nx>=0&&nx<GRID_SIZE&&ny<GRID_SIZE&&!moved[ny][nx]&&grid[ny][nx]===EMPTY){
              moveCell(x,y,nx,ny,oldT,elem);
              break;
            }
          }
        }
      }
      else{
        let diag=[];
        if(x>0 && y+1<GRID_SIZE && !moved[y+1][x-1] && grid[y+1][x-1]===EMPTY) diag.push(-1);
        if(x<GRID_SIZE-1 && y+1<GRID_SIZE && !moved[y+1][x+1] && grid[y+1][x+1]===EMPTY) diag.push(1);
        shuffle(diag);
        for(let d of diag){
          let nx=x+d, ny=y+1;
          if(grid[ny][nx]===EMPTY && !moved[ny][nx]){
            moveCell(x,y,nx,ny,oldT,elem);
            break;
          }
        }
      }
    }

    function moveWET_SAND(x,y,oldT,elem){
      if(y+1<GRID_SIZE && (grid[y+1][x]===EMPTY||grid[y+1][x]===WATER) && !moved[y+1][x]){
        moveCell(x,y,x,y+1,oldT,elem);
      }
    }

    function moveDoughBread(x,y,oldT,elem){
      if(y+1<GRID_SIZE && grid[y+1][x]===EMPTY && !moved[y+1][x]){
        moveCell(x,y,x,y+1,oldT,elem);
      }
    }

    function moveLikeLiquid(x,y,oldT,elem){
      if(y+1<GRID_SIZE && [EMPTY,WATER_VAPOR,CLOUD].includes(grid[y+1][x]) && !moved[y+1][x]){
        let below=grid[y+1][x];
        if((below===CLOUD||below===WATER_VAPOR) && y>0 && grid[y-1][x]===EMPTY && !moved[y-1][x]){
          let occupant=below; 
          let occupantTemp=temp[y+1][x];
          grid[y-1][x]=occupant;
          temp[y-1][x]=occupantTemp;
          moved[y-1][x]=true;
        }
        moveCell(x,y,x,y+1,oldT,elem);
      }
      else {
        let dirs=[];
        if(x>0 && grid[y][x-1]===EMPTY && !moved[y][x-1]) dirs.push(-1);
        if(x<GRID_SIZE-1 && grid[y][x+1]===EMPTY && !moved[y][x+1]) dirs.push(1);
        shuffle(dirs);
        for(let dir of dirs){
          let nx=x+dir,ny=y;
          if(grid[ny][nx]===EMPTY && !moved[ny][nx]){
            moveCell(x,y,nx,ny,oldT,elem);
            return;
          }
        }
        let diag=[];
        if(x>0 && y+1<GRID_SIZE && grid[y+1][x-1]===EMPTY && !moved[y+1][x-1]) diag.push(-1);
        if(x<GRID_SIZE-1 && y+1<GRID_SIZE && grid[y+1][x+1]===EMPTY && !moved[y+1][x+1]) diag.push(1);
        shuffle(diag);
        for(let d of diag){
          let nx=x+d, ny=y+1;
          if(grid[ny][nx]===EMPTY && !moved[ny][nx]){
            moveCell(x,y,nx,ny,oldT,elem);
            return;
          }
        }
      }
    }

    function moveVaporUp(x,y,oldT){
      let ty=y-1;
      if(ty>=0){
        if(grid[ty][x]===EMPTY && !moved[ty][x]){
          moveCell(x,y,x,ty,oldT,WATER_VAPOR);
          return;
        } else if(grid[ty][x]===WATER && !moved[ty][x]){
          let swpT=temp[ty][x];
          grid[ty][x]=WATER_VAPOR;
          temp[ty][x]=oldT;
          vaporLife[ty][x]=vaporLife[y][x];
          moved[ty][x]=true;
          grid[y][x]=WATER;
          temp[y][x]=swpT;
          return;
        }
      }
      let dirs=shuffle([-1,1]);
      for(let dir of dirs){
        let nx=x+dir, ny=y-1;
        if(nx>=0&&nx<GRID_SIZE&&ny>=0&&ny<GRID_SIZE&&grid[ny][nx]===EMPTY&&!moved[ny][nx]){
          moveCell(x,y,nx,ny,oldT,WATER_VAPOR);
          return;
        }
      }
    }

    function moveCloud(x,y,oldT){
      if(y-1>=0&&grid[y-1][x]===EMPTY&&!moved[y-1][x]){
        moveCell(x,y,x,y-1,oldT,CLOUD);
      } else {
        let dirs=shuffle([-1,1]);
        for(let dir of dirs){
          let nx=x+dir, ny=y-1;
          if(nx>=0&&nx<GRID_SIZE&&ny>=0&&ny<GRID_SIZE&&grid[ny][nx]===EMPTY&&!moved[ny][nx]){
            moveCell(x,y,nx,ny,oldT,CLOUD);
            break;
          }
        }
      }
    }

    function moveFire(x,y,oldT){
      let possible=[[0,-1],[-1,-1],[1,-1],[-1,0],[1,0]];
      shuffle(possible);
      for(let [dx,dy] of possible){
        let nx=x+dx, ny=y+dy;
        if(nx>=0&&nx<GRID_SIZE&&ny>=0&&ny<GRID_SIZE){
          if(grid[ny][nx]===EMPTY&&!moved[ny][nx]){
            moveCell(x,y,nx,ny,oldT,FIRE);
            break;
          }
        }
      }
    }

    function moveSmoke(x,y,oldT){
      if(y-1>=0&&grid[y-1][x]===EMPTY&&!moved[y-1][x]){
        moveCell(x,y,x,y-1,oldT,SMOKE);
      } else {
        let dirs=shuffle([-1,1]);
        for(let dir of dirs){
          let nx=x+dir, ny=y-1;
          if(nx>=0&&nx<GRID_SIZE&&ny>=0&&ny<GRID_SIZE&&grid[ny][nx]===EMPTY&&!moved[ny][nx]){
            moveCell(x,y,nx,ny,oldT,SMOKE);
            break;
          }
        }
      }
    }

    function moveGasElement(x,y,oldT,elem){
      let possible=[];
      for(let dy=-1;dy<=1;dy++){
        for(let dx=-1;dx<=1;dx++){
          if(dx===0&&dy===0) continue;
          let nx=x+dx, ny=y+dy;
          if(nx>=0&&nx<GRID_SIZE&&ny>=0&&ny<GRID_SIZE&&grid[ny][nx]===EMPTY&&!moved[ny][nx]){
            possible.push([dx,dy]);
          }
        }
      }
      if(possible.length>0){
        let [dx,dy]=possible[Math.floor(Math.random()*possible.length)];
        moveCell(x,y,x+dx,y+dy,oldT,elem);
      }
    }

    /***************************************
     * BOMBS & TEMPERATURE
     ***************************************/
    function explodeBomb(cx,cy){
      eraseCell(cx,cy);
      let radius=bombExplosionRadius;
      for(let dy=-radius;dy<=radius;dy++){
        for(let dx=-radius;dx<=radius;dx++){
          let x=cx+dx, y=cy+dy;
          if(x<0||x>=GRID_SIZE||y<0||y>=GRID_SIZE) continue;
          let dist=Math.sqrt(dx*dx+dy*dy);
          if(dist<=radius){
            if(grid[y][x]===BOMB){
              explodeBomb(x,y);
            } else {
              if(Math.random()<0.3){
                eraseCell(x,y);
              } else {
                grid[y][x]=FIRE;
                temp[y][x]=fireTemperature;
                fireLife[y][x]=0;
              }
            }
          }
        }
      }
    }

    function unifyCopperClusters(){
      // We'll leave the unify step for copper only for now.
      let visited=[];
      for(let y=0;y<GRID_SIZE;y++){
        visited[y]=[];
        for(let x=0;x<GRID_SIZE;x++){
          visited[y][x]=false;
        }
      }
      for(let y=0;y<GRID_SIZE;y++){
        for(let x=0;x<GRID_SIZE;x++){
          if(grid[y][x]===COPPER && !visited[y][x]){
            let cluster=[], sumT=0;
            let queue=[[x,y]];
            visited[y][x]=true;
            while(queue.length>0){
              let [cx,cy]=queue.shift();
              cluster.push([cx,cy]);
              sumT+=(temp[cy][cx]||0);
              for(let [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
                let nx=cx+dx, ny=cy+dy;
                if(nx>=0&&nx<GRID_SIZE&&ny>=0&&ny<GRID_SIZE){
                  if(!visited[ny][nx]&&grid[ny][nx]===COPPER){
                    visited[ny][nx]=true;
                    queue.push([nx,ny]);
                  }
                }
              }
            }
            let avg=sumT/cluster.length;
            for(let [cx,cy] of cluster){
              temp[cy][cx]=avg;
            }
          }
        }
      }
    }

    function updateTemperature(){
      let newTemp=[];
      for(let y=0;y<GRID_SIZE;y++){
        newTemp[y]=[];
        for(let x=0;x<GRID_SIZE;x++){
          newTemp[y][x]=temp[y][x];
        }
      }
      for(let y=0;y<GRID_SIZE;y++){
        for(let x=0;x<GRID_SIZE;x++){
          let e=grid[y][x];
          if(e===EMPTY||temp[y][x]===null){
            newTemp[y][x]=null;
            continue;
          }
          if(e===FIRE){
            newTemp[y][x]=fireTemperature;
            continue;
          }

          // Special: Heat Separator does NOT conduct heat to/from copper
          // We'll do normal conduction except if neighbor is copper or charged copper forms
          let oldT=temp[y][x];
          let wSum=0, tWeight=0;

          for(let dy=-1;dy<=1;dy++){
            for(let dx=-1;dx<=1;dx++){
              if(dx===0&&dy===0) continue;
              let ny=y+dy, nx=x+dx;
              if(nx>=0&&nx<GRID_SIZE&&ny>=0&&ny<GRID_SIZE){
                let ne=grid[ny][nx], nt=temp[ny][nx];
                if(ne!==EMPTY && nt!==null){
                  // If I'm a heat separator (charged or not) and neighbor is copper or charged copper => skip conduction
                  if(
                    (e===HEAT_SEPARATOR || e===CHARGED_HEAT_SEPARATOR || e===CHARGED_DOWN_HEAT_SEPARATOR)
                    &&
                    (ne===COPPER || ne===CHARGED_COPPER || ne===CHARGED_DOWN_COPPER)
                  ){
                    continue;
                  }
                  // also skip if I'm copper and neighbor is a heat separator
                  if(
                    (e===COPPER || e===CHARGED_COPPER || e===CHARGED_DOWN_COPPER)
                    &&
                    (ne===HEAT_SEPARATOR || ne===CHARGED_HEAT_SEPARATOR || ne===CHARGED_DOWN_HEAT_SEPARATOR)
                  ){
                    continue;
                  }

                  let cFactor=conductionRates[e]*conductionRates[ne];
                  wSum+=cFactor*nt;
                  tWeight+=cFactor;
                }
              }
            }
          }
          if(tWeight>0){
            let avg=wSum/tWeight;
            let cap=heatCapacities[e];
            let myFactor=conductionRates[e]*diffusionRate;
            let delta=myFactor*(avg-oldT)/cap;
            newTemp[y][x]=oldT+delta;
          }
        }
      }
      temp=newTemp;
    }

    /***************************************
     * REACTIONS & TRANSFORMS
     ***************************************/
    function processTransformations(){
      transformLavaToRock();
      transformWaterAndLavaToStone();
      transformWaterVapor();
      transformCloudToWater();
      transformIceWater();
      transformFireToSmoke();
      transformBurningWood();
      transformWoodIgnition();
      transformBurningLeaves();
      transformSandToGlass();
      transformDirtWetDirt();
      transformSandWetSand();
      transformFlourToDough();
      transformDoughToBread();
      transformBreadToAshIfHot();
      handleSeedsGrowth();
      handleWheatGrowth();
      handleWheatRootGrowth();
      handleRootsAbsorbWater();
      handleFlammables();
      handleOakTreeGrowth();
      handleOakTreeRootGrowth();
      handleGrassGrowth();
      igniteHotElements();
      triggerBombs();
      transformGas();
      handleBurningGas();
      transformRoots();
      handleChargedCopper(); 
      handleElectricalElements(); // new function
      handleCoolerHeater(); // updated
    }

    /***************************************
     * NEW: igniteFlammable to fix the error
     ***************************************/
    function igniteFlammable(x, y){
      if(x<0||x>=GRID_SIZE||y<0||y>=GRID_SIZE) return;
      let e = grid[y][x];
      if(e===WOOD){
        grid[y][x]=BURNING_WOOD; 
        burningWoodTime[y][x]=0; 
        sparkTimer[y][x]=0; 
        temp[y][x]=fireTemperature;
      } else if(e===FLOUR|| e===WHEAT_SEEDS|| e===WHEAT){
        grid[y][x]=BURNING_ORGANIC; 
        burningWoodTime[y][x]=0; 
        sparkTimer[y][x]=0; 
        temp[y][x]=fireTemperature;
      } else if(e===OAK_LEAVES||e===OAK_BABY_LEAVES){
        grid[y][x]=BURNING_LEAVES; 
        sparkTimer[y][x]=0; 
        temp[y][x]=fireTemperature;
      } else if(e===GRASS){
        grid[y][x]=BURNING_ORGANIC; 
        burningWoodTime[y][x]=0; 
        sparkTimer[y][x]=0; 
        temp[y][x]=fireTemperature;
      } 
    }

    function handleBurningGas(){
      for(let y=0;y<GRID_SIZE;y++){
        for(let x=0;x<GRID_SIZE;x++){
          if(grid[y][x]===BURNING_GAS){
            burningGasTime[y][x]+=simulationTimeStep;
            let nb=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
            for(let [dx,dy] of nb){
              let nx=x+dx, ny=y+dy;
              if(nx>=0&&nx<GRID_SIZE&&ny>=0&&ny<GRID_SIZE){
                let e=grid[ny][nx];
                if(e===GAS){
                  grid[ny][nx]=BURNING_GAS;
                  temp[ny][nx]=fireTemperature;
                  burningGasTime[ny][nx]=0;
                }
                igniteFlammable(nx, ny);
              }
            }
            if(burningGasTime[y][x]>=burningGasDuration){
              grid[y][x]=SMOKE;
              temp[y][x]=80;
              smokeLife[y][x]=0;
              smokeMaxLife[y][x]=1+2*Math.random();
              burningGasTime[y][x]=0;
            }
          }
        }
      }
    }

    function transformGas(){
      for(let y=0;y<GRID_SIZE;y++){
        for(let x=0;x<GRID_SIZE;x++){
          if(grid[y][x]===GAS){
            if(temp[y][x]>=300){
              grid[y][x]=BURNING_GAS;
              temp[y][x]=fireTemperature;
              burningGasTime[y][x]=0;
            } else {
              let nb=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
              for(let [dx,dy] of nb){
                let nx=x+dx, ny=y+dy;
                if(nx>=0&&nx<GRID_SIZE&&ny>=0&&ny<GRID_SIZE){
                  let e=grid[ny][nx];
                  if(e===FIRE||e===BURNING_WOOD||e===BURNING_ORGANIC||e===BURNING_LEAVES||e===BURNING_ROOT||e===BURNING_GAS){
                    grid[y][x]=BURNING_GAS;
                    temp[y][x]=fireTemperature;
                    burningGasTime[y][x]=0;
                    break;
                  }
                }
              }
            }
          }
        }
      }
    }

    /***************************************
     * WHEAT: handleSeedsGrowth, etc
     ***************************************/
    function handleSeedsGrowth(){
      for(let y=0;y<GRID_SIZE-1;y++){
        for(let x=0;x<GRID_SIZE;x++){
          if(grid[y][x]===WHEAT_SEEDS){
            let below=grid[y+1][x];
            if(below===DIRT||below===WET_DIRT||below===SAND||below===WET_SAND||below===ROOT){
              seedGrowthTime[y][x]+=simulationTimeStep;
              if(seedGrowthTime[y][x]>=3){
                grid[y][x]=WHEAT;temp[y][x]=20;
                wheatHeight[y][x]=1;
                wheatMaxHeight[y][x]=2+Math.floor(Math.random()*4);
              }
            }
          }
        }
      }
    }
    function handleWheatGrowth(){
      for(let y=0;y<GRID_SIZE;y++){
        for(let x=0;x<GRID_SIZE;x++){
          if(grid[y][x]===WHEAT){
            let h=wheatHeight[y][x], mh=wheatMaxHeight[y][x];
            if(h<mh){
              if(Math.random()<0.01){
                if(y>0&&grid[y-1][x]===EMPTY){
                  grid[y-1][x]=WHEAT;temp[y-1][x]=20;
                  wheatHeight[y-1][x]=h+1;
                  wheatMaxHeight[y-1][x]=mh;
                }
              }
            }
          }
        }
      }
    }
    function handleWheatRootGrowth(){
      for(let y=0;y<GRID_SIZE-1;y++){
        for(let x=0;x<GRID_SIZE;x++){
          if(grid[y][x]===WHEAT){
            for(let depth=1; depth<=2; depth++){
              let ny=y+depth;
              if(ny<GRID_SIZE){
                if(grid[ny][x]===EMPTY || grid[ny][x]===DIRT || grid[ny][x]===WET_DIRT || grid[ny][x]===SAND || grid[ny][x]===WET_SAND){
                  if(Math.random()<0.0005){
                    placeElementAt(x,ny,ROOT);
                  }
                } else {
                  break;
                }
              }
            }
          }
        }
      }
    }
    function handleRootsAbsorbWater(){
      for(let y=0;y<GRID_SIZE;y++){
        for(let x=0;x<GRID_SIZE;x++){
          if(grid[y][x]===ROOT){
            let nb=[[1,0],[-1,0],[0,1],[0,-1]];
            for(let [dx,dy] of nb){
              let nx=x+dx, ny=y+dy;
              if(nx>=0&&nx<GRID_SIZE&&ny>=0&&ny<GRID_SIZE){
                if(grid[ny][nx]===WET_DIRT){
                  grid[ny][nx]=DIRT;temp[ny][nx]=20;
                } else if(grid[ny][nx]===WET_SAND){
                  grid[ny][nx]=SAND;temp[ny][nx]=20;
                }
              }
            }
          }
        }
      }
    }

    function handleFlammables(){
      for(let y=0;y<GRID_SIZE;y++){
        for(let x=0;x<GRID_SIZE;x++){
          if(grid[y][x]===BURNING_ORGANIC){
            sparkTimer[y][x]+=simulationTimeStep;
            let sparkLimit=0.2+0.1*Math.random();
            if(sparkTimer[y][x]>=sparkLimit){
              let nb=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
              shuffle(nb);
              for(let [dx,dy] of nb){
                let nx=x+dx, ny=y+dy;
                if(nx>=0&&nx<GRID_SIZE&&ny>=0&&ny<GRID_SIZE){
                  if(grid[ny][nx]===EMPTY){
                    grid[ny][nx]=FIRE;temp[ny][nx]=fireTemperature;fireLife[ny][nx]=0;
                    break;
                  }
                }
              }
              sparkTimer[y][x]=0;
            }
            burningWoodTime[y][x]+=simulationTimeStep;
            if(burningWoodTime[y][x]>=1.0){
              let r=Math.random();
              if(r<burnToAshChance){
                grid[y][x]=ASH;temp[y][x]=50;
              } else {
                grid[y][x]=FIRE;temp[y][x]=fireTemperature;fireLife[y][x]=0;
              }
            }
          }
        }
      }
    }

    /***************************************
     * Oak Tree Growth
     ***************************************/
    function handleOakTreeGrowth(){
      for(let y=0;y<GRID_SIZE;y++){
        for(let x=0;x<GRID_SIZE;x++){
          if(grid[y][x]===OAK_SEEDS){
            if(y===GRID_SIZE-1){
              grid[y][x]=DEAD_OAK;temp[y][x]=20;
            } else if(![SAND,DIRT,WET_DIRT,WET_SAND].includes(grid[y+1][x])){
              grid[y][x]=DEAD_OAK;temp[y][x]=20;
            } else {
              oakTreeGrowthTime[y][x]+=simulationTimeStep;
              if(oakTreeGrowthTime[y][x]>=15.0){
                grid[y][x]=WOOD;temp[y][x]=20;
                oakTreeHeight[y][x]=1;
                oakTreeMaxHeight[y][x]=10+Math.floor(Math.random()*11);
                oakTreeRootTimer[y][x]=0;
                oakTreeRootDepth[y][x]=0;
                oakTreeRootMax[y][x]=8+Math.floor(Math.random()*6);
                branchLevel[y][x]=0;
                branchLen[y][x]=0;
                branchDirX[y][x]=0;
                branchDirY[y][x]=0;
                for(let dy=-1; dy<=1; dy++){
                  for(let dx=-1; dx<=1; dx++){
                    let nx=x+dx, ny=y+dy;
                    if(nx>=0&&nx<GRID_SIZE&&ny>=0&&ny<GRID_SIZE&&grid[ny][nx]===EMPTY){
                      grid[ny][nx]=OAK_BABY_LEAVES;temp[ny][nx]=20;
                    }
                  }
                }
              }
            }
          } else if(grid[y][x]===WOOD && branchLevel[y][x]===0){
            if(oakTreeHeight[y][x]<oakTreeMaxHeight[y][x]){
              if(y>0 && (grid[y-1][x]===EMPTY||grid[y-1][x]===WOOD||grid[y-1][x]===OAK_LEAVES||grid[y-1][x]===OAK_BABY_LEAVES) && Math.random()<0.005){
                grid[y-1][x]=WOOD;temp[y-1][x]=20;
                oakTreeHeight[y-1][x]=oakTreeHeight[y][x]+1;
                oakTreeMaxHeight[y-1][x]=oakTreeMaxHeight[y][x];
                branchLevel[y-1][x]=0;
                branchLen[y-1][x]=0;
                branchDirX[y-1][x]=0;
                branchDirY[y-1][x]=0;
              }
            }
          }
          if(grid[y][x]===WOOD && branchLevel[y][x]===1){
            if(branchLen[y][x]<branchMaxArr[y][x]){
              let branchExtensionProb=0.0005;
              if(Math.random()<branchExtensionProb){
                let bx= x+ branchDirX[y][x];
                let by= y+ branchDirY[y][x];
                if(bx>=0&&bx<GRID_SIZE&&by>=0&&by<GRID_SIZE &&
                  (grid[by][bx]===EMPTY||grid[by][bx]===OAK_LEAVES||grid[by][bx]===OAK_BABY_LEAVES)){
                  grid[by][bx]=WOOD;temp[by][bx]=20;
                  oakTreeHeight[by][bx]=oakTreeHeight[y][x];
                  oakTreeMaxHeight[by][bx]=oakTreeMaxHeight[y][x];
                  branchLevel[by][bx]=1;
                  branchLen[by][bx]=branchLen[y][x]+1;
                  branchMaxArr[by][bx]=branchMaxArr[y][x];
                  branchDirX[by][bx]=branchDirX[y][x];
                  branchDirY[by][bx]=branchDirY[y][x];
                  let leafDirs=[[-1,-1],[0,-1],[1,-1],[-1,0],[1,0]];
                  for(let [ldx,ldy] of leafDirs){
                    let lx=bx+ldx, ly=by+ldy;
                    if(lx>=0&&lx<GRID_SIZE&&ly>=0&&ly<GRID_SIZE&&grid[ly][lx]===EMPTY){
                      grid[ly][lx]=OAK_LEAVES;temp[ly][lx]=20;
                    }
                  }
                }
              }
            }
          }
          if(grid[y][x]===WOOD && oakTreeHeight[y][x]>=5 && branchLevel[y][x]===0){
            if(branchSubCount[y][x]<1){
              let branchFormationProb=0.001;
              if(Math.random()<branchFormationProb){
                let branchDirs=[[-1,-1],[1,-1]];
                let chosen=branchDirs[Math.floor(Math.random()*branchDirs.length)];
                let bx=x+chosen[0], by=y+chosen[1];
                if(bx>=0&&bx<GRID_SIZE&&by>=0&&by<GRID_SIZE &&
                   (grid[by][bx]===EMPTY||grid[by][bx]===OAK_LEAVES||grid[by][bx]===OAK_BABY_LEAVES)){
                  grid[by][bx]=WOOD;temp[by][bx]=20;
                  oakTreeHeight[by][bx]=oakTreeHeight[y][x];
                  oakTreeMaxHeight[by][bx]=oakTreeMaxHeight[y][x];
                  branchLevel[by][bx]=1;
                  branchLen[by][bx]=1;
                  branchMaxArr[by][bx]=(oakTreeHeight[y][x]===5)?1:(4+Math.floor(Math.random()*4));
                  branchDirX[by][bx]=chosen[0];
                  branchDirY[by][bx]=chosen[1];
                  let leafDirs=[[-1,-1],[0,-1],[1,-1],[-1,0],[1,0]];
                  for(let [ldx,ldy] of leafDirs){
                    let lx=bx+ldx, ly=by+ldy;
                    if(lx>=0&&lx<GRID_SIZE&&ly>=0&&ly<GRID_SIZE&&grid[ly][lx]===EMPTY){
                      grid[ly][lx]=OAK_LEAVES;temp[ly][lx]=20;
                    }
                  }
                  branchSubCount[y][x]=1;
                }
              }
            }
          }
          if(grid[y][x]===WOOD && oakTreeHeight[y][x]>=7){
            let sideDirs=[[-1,0],[1,0],[-1,-1],[1,-1]];
            for(let [dx,dy] of sideDirs){
              let nx=x+dx, ny=y+dy;
              if(nx>=0&&nx<GRID_SIZE&&ny>=0&&ny<GRID_SIZE){
                if(grid[ny][nx]===EMPTY&&Math.random()<0.3){
                  grid[ny][nx]=OAK_LEAVES;temp[ny][nx]=20;
                }
              }
            }
          }
        }
      }
      // remove baby leaves if near tall trunk
      for(let y=0;y<GRID_SIZE;y++){
        for(let x=0;x<GRID_SIZE;x++){
          if(grid[y][x]===OAK_BABY_LEAVES){
            let remove=false;
            for(let dy=-1;dy<=1;dy++){
              for(let dx=-1;dx<=1;dx++){
                let nx=x+dx, ny=y+dy;
                if(nx>=0&&nx<GRID_SIZE&&ny>=0&&ny<GRID_SIZE){
                  if(grid[ny][nx]===WOOD && oakTreeHeight[ny][nx]>=5){
                    remove=true; break;
                  }
                }
              }
              if(remove) break;
            }
            if(remove){
              eraseCell(x,y);
            }
          }
        }
      }
    }

    function handleOakTreeRootGrowth(){
      const oakRootGrowthThreshold=5.0;
      for(let y=0;y<GRID_SIZE-1;y++){
        for(let x=0;x<GRID_SIZE;x++){
          if(grid[y][x]===WOOD && oakTreeHeight[y][x]>0){
            if(oakTreeRootDepth[y][x]<oakTreeRootMax[y][x]){
              oakTreeRootTimer[y][x]+=simulationTimeStep;
              if(oakTreeRootTimer[y][x]>=oakRootGrowthThreshold){
                let d=0;
                while(y+d+1<GRID_SIZE&&grid[y+d+1][x]===ROOT){
                  d++;
                }
                let targetY=y+d+1;
                if(targetY<GRID_SIZE&&(
                  grid[targetY][x]===EMPTY||grid[targetY][x]===DIRT||grid[targetY][x]===WET_DIRT||
                  grid[targetY][x]===SAND||grid[targetY][x]===ROOT||grid[targetY][x]===WET_SAND
                )){
                  placeElementAt(x,targetY,ROOT);
                  oakTreeRootDepth[y][x]+=1;
                }
                if(targetY<GRID_SIZE){
                  if(x-1>=0 && (
                    grid[targetY][x-1]===EMPTY||grid[targetY][x-1]===DIRT||grid[targetY][x-1]===WET_DIRT||
                    grid[targetY][x-1]===SAND||grid[targetY][x-1]===ROOT||grid[targetY][x-1]===WET_SAND
                  )&& Math.random()<0.3){
                    placeElementAt(x-1,targetY,ROOT);
                  }
                  if(x+1<GRID_SIZE && (
                    grid[targetY][x+1]===EMPTY||grid[targetY][x+1]===DIRT||grid[targetY][x+1]===WET_DIRT||
                    grid[targetY][x+1]===SAND||grid[targetY][x+1]===ROOT||grid[targetY][x+1]===WET_SAND
                  )&& Math.random()<0.3){
                    placeElementAt(x+1,targetY,ROOT);
                  }
                }
                oakTreeRootTimer[y][x]=0;
              }
            }
          }
        }
      }
    }

    /***************************************
     * Grass Growth
     ***************************************/
    function handleGrassGrowth(){
      for(let y=0;y<GRID_SIZE;y++){
        for(let x=0;x<GRID_SIZE;x++){
          if(grid[y][x]===GRASS){
            let st=grassStage[y][x];
            if(st===1){
              if(y>0&&grid[y-1][x]===EMPTY){
                if(Math.random()<0.0005){
                  grid[y-1][x]=GRASS;
                  grassStage[y-1][x]=2;
                  temp[y-1][x]=20;
                }
              }
            }
            // Spread
            let neighbors=[[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]];
            for(let [dx,dy] of neighbors){
              let nx=x+dx, ny=y+dy;
              if(nx<0||nx>=GRID_SIZE||ny<0||ny>=GRID_SIZE) continue;
              if(grid[ny][nx]===DIRT||grid[ny][nx]===WET_DIRT){
                let ay=ny-1;
                if(ay>=0){
                  if(grid[ay][nx]===EMPTY){
                    if(Math.random()<0.0003){
                      grid[ny][nx]=GRASS;
                      grassStage[ny][nx]=1;
                      temp[ny][nx]=20;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    /***************************************
     * Roots: transformRoots
     ***************************************/
    function transformRoots(){
      for(let y=0;y<GRID_SIZE;y++){
        for(let x=0;x<GRID_SIZE;x++){
          if(grid[y][x]===ROOT && temp[y][x]>=200){
            grid[y][x]=BURNING_ROOT;burningWoodTime[y][x]=0;sparkTimer[y][x]=0;temp[y][x]=fireTemperature;
          } else if(grid[y][x]===BURNING_ROOT){
            burningWoodTime[y][x]+=simulationTimeStep;
            if(burningWoodTime[y][x]>=burnDuration){
              grid[y][x]=DEAD_ROOT;temp[y][x]=20;
            }
          }
        }
      }
    }

    function igniteHotElements(){
      for(let y=0;y<GRID_SIZE;y++){
        for(let x=0;x<GRID_SIZE;x++){
          let t=temp[y][x];
          if(t!==null&&t>200){
            let e=grid[y][x];
            if(e===WOOD){
              grid[y][x]=BURNING_WOOD;burningWoodTime[y][x]=0;sparkTimer[y][x]=0;temp[y][x]=fireTemperature;
            } else if(e===FLOUR||e===WHEAT_SEEDS||e===WHEAT){
              grid[y][x]=BURNING_ORGANIC;burningWoodTime[y][x]=0;sparkTimer[y][x]=0;temp[y][x]=fireTemperature;
            } else if(e===OAK_LEAVES||e===OAK_BABY_LEAVES){
              grid[y][x]=BURNING_LEAVES;sparkTimer[y][x]=0;temp[y][x]=fireTemperature;
            }
          }
        }
      }
    }

    function triggerBombs(){
      for(let y=0;y<GRID_SIZE;y++){
        for(let x=0;x<GRID_SIZE;x++){
          if(grid[y][x]===BOMB){
            if(temp[y][x]>=200) explodeBomb(x,y);
            let neighbors=[[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]];
            for(let [dx,dy] of neighbors){
              let nx=x+dx, ny=y+dy;
              if(nx>=0&&nx<GRID_SIZE&&ny>=0&&ny<GRID_SIZE){
                let e=grid[ny][nx];
                if(e===FIRE||e===BURNING_WOOD||e===BURNING_LEAVES||e===BURNING_ORGANIC||e===BURNING_ROOT||e===BURNING_GAS){
                  explodeBomb(x,y);
                  break;
                }
              }
            }
          }
        }
      }
    }

    /***************************************
     * Charged Copper
     ***************************************/
    function handleChargedCopper(){
      // pass 1: turn CHARGED_COPPER -> CHARGED_DOWN_COPPER after charging
      let cpy = grid.map(r=>r.slice());

      for(let y=0;y<GRID_SIZE;y++){
        for(let x=0;x<GRID_SIZE;x++){
          if(grid[y][x]===CHARGED_COPPER){
            let adj=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
            for(let [dx,dy] of adj){
              let nx=x+dx, ny=y+dy;
              if(nx>=0&&nx<GRID_SIZE&&ny>=0&&ny<GRID_SIZE){
                // only charge copper if temp < 300
                if(cpy[ny][nx]===COPPER && temp[ny][nx]<300){
                  cpy[ny][nx]=CHARGED_COPPER;
                  temp[ny][nx]=Math.min(temp[ny][nx]+50, 1200);
                  chargedStateTime[ny][nx]=0;
                }
              }
            }
            // after trying to charge neighbors, become charged-down
            cpy[y][x]=CHARGED_DOWN_COPPER;
            chargedStateTime[y][x]=0;
          }
        }
      }
      grid=cpy;

      // pass 2: time checks
      for(let y=0;y<GRID_SIZE;y++){
        for(let x=0;x<GRID_SIZE;x++){
          let e=grid[y][x];
          if(e===CHARGED_COPPER){
            chargedStateTime[y][x]+=simulationTimeStep;
            let anyCopper=false;
            let adj=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
            for(let [dx,dy] of adj){
              let nx=x+dx, ny=y+dy;
              if(nx>=0&&nx<GRID_SIZE&&ny>=0&&ny<GRID_SIZE){
                if(grid[ny][nx]===COPPER && temp[ny][nx]<300){
                  anyCopper=true;
                  break;
                }
              }
            }
            if(!anyCopper || chargedStateTime[y][x]>=1.0){
              grid[y][x]=CHARGED_DOWN_COPPER;
              chargedStateTime[y][x]=0;
            }
          } else if(e===CHARGED_DOWN_COPPER){
            chargedStateTime[y][x]+=simulationTimeStep;
            if(chargedStateTime[y][x]>=1.0){
              grid[y][x]=COPPER;
              chargedStateTime[y][x]=0;
            }
          }
        }
      }
    }

    /***************************************
     * NEW: handleElectricalElements
     ***************************************/
    function handleElectricalElements(){
      let cpy=grid.map(r=>r.slice());

      // 1) Heat Separator charging logic (similar to copper)
      for(let y=0;y<GRID_SIZE;y++){
        for(let x=0;x<GRID_SIZE;x++){
          if(grid[y][x]===CHARGED_HEAT_SEPARATOR){
            let adj=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
            for(let [dx,dy] of adj){
              let nx=x+dx, ny=y+dy;
              if(nx>=0&&nx<GRID_SIZE&&ny>=0&&ny<GRID_SIZE){
                if(cpy[ny][nx]===HEAT_SEPARATOR && temp[ny][nx]<300){
                  cpy[ny][nx]=CHARGED_HEAT_SEPARATOR;
                  temp[ny][nx]=Math.min(temp[ny][nx]+50,1200);
                  chargedStateTime[ny][nx]=0;
                }
                if(cpy[ny][nx]===COPPER && temp[ny][nx]<300){
                  cpy[ny][nx]=CHARGED_COPPER;
                  temp[ny][nx]=Math.min(temp[ny][nx]+50,1200);
                  chargedStateTime[ny][nx]=0;
                }
              }
            }
            // become charged-down
            cpy[y][x]=CHARGED_DOWN_HEAT_SEPARATOR;
            chargedStateTime[y][x]=0;
          }
        }
      }
      grid=cpy;

      // 2) timed reverts for heat separators
      for(let y=0;y<GRID_SIZE;y++){
        for(let x=0;x<GRID_SIZE;x++){
          let e=grid[y][x];
          if(e===CHARGED_HEAT_SEPARATOR){
            chargedStateTime[y][x]+=simulationTimeStep;
            if(chargedStateTime[y][x]>=1.0){
              grid[y][x]=CHARGED_DOWN_HEAT_SEPARATOR;
              chargedStateTime[y][x]=0;
            }
          } else if(e===CHARGED_DOWN_HEAT_SEPARATOR){
            chargedStateTime[y][x]+=simulationTimeStep;
            if(chargedStateTime[y][x]>=1.0){
              grid[y][x]=HEAT_SEPARATOR;
              chargedStateTime[y][x]=0;
            }
          }
        }
      }

      // 3) Input: becomes charged if near charged copper/heat-separator, etc.
      cpy=grid.map(r=>r.slice());
      for(let y=0;y<GRID_SIZE;y++){
        for(let x=0;x<GRID_SIZE;x++){
          if(grid[y][x]===INPUT){
            let neighbors=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
            for(let [dx,dy] of neighbors){
              let nx=x+dx, ny=y+dy;
              if(nx>=0 && nx<GRID_SIZE && ny>=0 && ny<GRID_SIZE){
                let ne=grid[ny][nx];
                if(
                  ne===CHARGED_COPPER||ne===CHARGED_DOWN_COPPER||
                  ne===CHARGED_HEAT_SEPARATOR||ne===CHARGED_DOWN_HEAT_SEPARATOR
                ){
                  cpy[y][x]=CHARGED_INPUT;
                  chargedStateTime[y][x]=0;
                  break;
                }
              }
            }
          }
        }
      }
      grid=cpy;

      // 4) Output: can be charged if next to a charge source. If so => it charges copper neighbors
      cpy=grid.map(r=>r.slice());
      for(let y=0;y<GRID_SIZE;y++){
        for(let x=0;x<GRID_SIZE;x++){
          let e=grid[y][x];
          if(e===OUTPUT){
            let neighbors=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
            let doCharge=false;
            for(let [dx,dy] of neighbors){
              let nx=x+dx, ny=y+dy;
              if(nx>=0 && nx<GRID_SIZE && ny>=0 && ny<GRID_SIZE){
                let ne=grid[ny][nx];
                // treat these as valid charging sources
                if(ne===CHARGED_INPUT || ne===CHARGED_COPPER || ne===CHARGED_DOWN_COPPER ||
                   ne===CHARGED_HEAT_SEPARATOR || ne===CHARGED_DOWN_HEAT_SEPARATOR ||
                   ne===CHARGED_OUTPUT){
                  doCharge=true; 
                  break;
                }
              }
            }
            if(doCharge){
              cpy[y][x]=CHARGED_OUTPUT;
              // initialize charged timer
              chargedStateTime[y][x]=chargedStateTime[y][x] || 0;
            }
          }
          else if(e===CHARGED_OUTPUT){
            // charge copper neighbors
            let neighbors=[[1,0],[-1,0],[0,1],[0,-1]];
            for(let [dx,dy] of neighbors){
              let nx=x+dx, ny=y+dy;
              if(nx>=0 && nx<GRID_SIZE && ny>=0 && ny<GRID_SIZE){
                if(cpy[ny][nx]===COPPER && temp[ny][nx]<300){
                  cpy[ny][nx]=CHARGED_COPPER;
                  temp[ny][nx]=Math.min(temp[ny][nx]+50,1200);
                  chargedStateTime[ny][nx]=0;
                }
              }
            }
          }
        }
      }
      grid=cpy;

      // 4b) Uncharge output after 3 seconds:
      for(let y=0;y<GRID_SIZE;y++){
        for(let x=0;x<GRID_SIZE;x++){
          if(grid[y][x]===CHARGED_OUTPUT){
            chargedStateTime[y][x]+=simulationTimeStep;
            if(chargedStateTime[y][x]>=3.0){ // revert to normal Output after 3s
              grid[y][x]=OUTPUT;
              chargedStateTime[y][x]=0;
            }
          }
        }
      }

      // 5) Not Gate logic
      cpy=grid.map(r=>r.slice());
      for(let y=0;y<GRID_SIZE;y++){
        for(let x=0;x<GRID_SIZE;x++){
          if(grid[y][x]===NOT_GATE){
            let neighbors=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
            let hasChargedInput=false;
            let hasChargedCopper=false;
            for(let [dx,dy] of neighbors){
              let nx=x+dx, ny=y+dy;
              if(nx<0||nx>=GRID_SIZE||ny<0||ny>=GRID_SIZE) continue;
              let ne=grid[ny][nx];
              if(ne===CHARGED_INPUT) hasChargedInput=true;
              if(
                ne===CHARGED_COPPER||ne===CHARGED_DOWN_COPPER||
                ne===CHARGED_HEAT_SEPARATOR||ne===CHARGED_DOWN_HEAT_SEPARATOR||
                ne===CHARGED_INPUT|| ne===CHARGED_OUTPUT
              ){
                hasChargedCopper=true;
              }
            }
            if(hasChargedInput){
              // if also touching "charged copper," no output
              if(!hasChargedCopper){
                // charge any OUTPUT neighbors
                for(let [dx,dy] of neighbors){
                  let nx=x+dx, ny=y+dy;
                  if(nx<0||nx>=GRID_SIZE||ny<0||ny>=GRID_SIZE) continue;
                  if(grid[ny][nx]===OUTPUT){
                    cpy[ny][nx]=CHARGED_OUTPUT;
                    chargedStateTime[ny][nx]=0;
                  }
                }
              }
            }
          }
        }
      }
      grid=cpy;

      // 6) And Gate logic
      cpy=grid.map(r=>r.slice());
      for(let y=0;y<GRID_SIZE;y++){
        for(let x=0;x<GRID_SIZE;x++){
          if(grid[y][x]===AND_GATE){
            let neighbors=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
            let chargedInputCount=0;
            for(let [dx,dy] of neighbors){
              let nx=x+dx, ny=y+dy;
              if(nx<0||nx>=GRID_SIZE||ny<0||ny>=GRID_SIZE) continue;
              if(grid[ny][nx]===CHARGED_INPUT){
                chargedInputCount++;
              }
            }
            if(chargedInputCount>=2){
              for(let [dx,dy] of neighbors){
                let nx=x+dx, ny=y+dy;
                if(nx<0||nx>=GRID_SIZE||ny<0||ny>=GRID_SIZE) continue;
                if(grid[ny][nx]===OUTPUT){
                  cpy[ny][nx]=CHARGED_OUTPUT;
                  chargedStateTime[ny][nx]=0;
                }
              }
            }
          }
        }
      }
      grid=cpy;

      // 7) Blocker => becomes "charged" if it sees a charged input + copper
      cpy=grid.map(r=>r.slice());
      for(let y=0;y<GRID_SIZE;y++){
        for(let x=0;x<GRID_SIZE;x++){
          if(grid[y][x]===BLOCKER){
            let neighbors=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
            let hasChargedInput=false;
            let hasCopper=false;
            for(let [dx,dy] of neighbors){
              let nx=x+dx, ny=y+dy;
              if(nx<0||nx>=GRID_SIZE||ny<0||ny>=GRID_SIZE) continue;
              if(grid[ny][nx]===CHARGED_INPUT){
                hasChargedInput=true;
              }
              if(grid[ny][nx]===COPPER||grid[ny][nx]===CHARGED_COPPER||grid[ny][nx]===CHARGED_DOWN_COPPER){
                hasCopper=true;
              }
            }
            if(hasChargedInput && hasCopper){
              // We'll transform it to CHARGED_OUTPUT, so it can charge copper
              cpy[y][x]=CHARGED_OUTPUT;
              chargedStateTime[y][x]=0;
            }
          }
        }
      }
      grid=cpy;

      // 7b) Uncharging logic:
      //    - CHARGED INPUT reverts to normal INPUT if not next to a charge source
      //    - We'll do a pass to see if it's actually still next to copper or not
      cpy=grid.map(r=>r.slice());
      for(let y=0;y<GRID_SIZE;y++){
        for(let x=0;x<GRID_SIZE;x++){
          if(grid[y][x]===CHARGED_INPUT){
            let neighbors=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
            let stillCharged=false;
            for(let [dx,dy] of neighbors){
              let nx=x+dx, ny=y+dy;
              if(nx<0||nx>=GRID_SIZE||ny<0||ny>=GRID_SIZE) continue;
              let ne=grid[ny][nx];
              if(
                ne===CHARGED_COPPER||ne===CHARGED_DOWN_COPPER||
                ne===CHARGED_HEAT_SEPARATOR||ne===CHARGED_DOWN_HEAT_SEPARATOR
              ){
                stillCharged=true;
                break;
              }
            }
            if(!stillCharged){
              cpy[y][x]=INPUT;
              chargedStateTime[y][x]=0;
            }
          }
        }
      }
      grid=cpy;
    }

    /***************************************
     * COOLER & HEATER
     ***************************************/
    function handleCoolerHeater(){
      // Must see CHARGED_INPUT neighbor to operate
      for(let y=0;y<GRID_SIZE;y++){
        for(let x=0;x<GRID_SIZE;x++){
          let e=grid[y][x];
          if(e===COOLER || e===HEATER){
            let neighbors=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
            let hasChargedInput=false;
            for(let [dx,dy] of neighbors){
              let nx=x+dx, ny=y+dy;
              if(nx>=0&&nx<GRID_SIZE&&ny>=0&&ny<GRID_SIZE){
                if(grid[ny][nx]===CHARGED_INPUT){
                  hasChargedInput=true;
                  break;
                }
              }
            }
            if(!hasChargedInput) continue; // no effect

            // apply effect to any CHARGED_COPPER or CHARGED_DOWN_COPPER neighbors
            for(let [dx,dy] of neighbors){
              let nx=x+dx, ny=y+dy;
              if(nx>=0&&nx<GRID_SIZE&&ny>=0&&ny<GRID_SIZE){
                let e2=grid[ny][nx];
                if(e2===CHARGED_COPPER || e2===CHARGED_DOWN_COPPER){
                  if(e===COOLER){
                    temp[ny][nx] = Math.max(temp[ny][nx] - 100 * simulationTimeStep, -1000);
                  } else {
                    temp[ny][nx] = Math.min(temp[ny][nx] + 100 * simulationTimeStep, 3000);
                  }
                }
              }
            }
          }
        }
      }
    }

    /***************************************
     * The rest of transformations
     ***************************************/
    function transformLavaToRock(){
      for(let y=0;y<GRID_SIZE;y++){
        for(let x=0;x<GRID_SIZE;x++){
          let e=grid[y][x], t=temp[y][x];
          if(e===LAVA&&t<600){
            if(Math.random()<0.5) {grid[y][x]=BASALT;temp[y][x]=500;}
            else {grid[y][x]=OBSIDIAN;temp[y][x]=500;}
          }
          if(e===BASALT&&t>=800){
            grid[y][x]=LAVA;temp[y][x]=1200;
          }
          if(e===OBSIDIAN&&t>=700){
            grid[y][x]=MOLTEN_SLAG;temp[y][x]=1200;
          }
          if(e===MOLTEN_SLAG&&t<800){
            grid[y][x]=OBSIDIAN;temp[y][x]=600;
          }
        }
      }
    }

    function transformWaterAndLavaToStone(){
      let cpy=grid.map(r=>r.slice());
      for(let y=0;y<GRID_SIZE;y++){
        for(let x=0;x<GRID_SIZE;x++){
          let e=grid[y][x];
          if(e===WATER||e===LAVA){
            for(let dy=-1;dy<=1;dy++){
              for(let dx=-1;dx<=1;dx++){
                let ny=y+dy,nx=x+dx;
                if(nx>=0&&nx<GRID_SIZE&&ny>=0&&ny<GRID_SIZE){
                  if((e===WATER&&grid[ny][nx]===LAVA)||(e===LAVA&&grid[ny][nx]===WATER)){
                    cpy[y][x]=STONE;temp[y][x]=20;
                    cpy[ny][nx]=STONE;temp[ny][nx]=20;
                  }
                }
              }
            }
          }
        }
      }
      grid=cpy;
    }

    function transformWaterVapor(){
      for(let y=0;y<GRID_SIZE;y++){
        for(let x=0;x<GRID_SIZE;x++){
          if(grid[y][x]===WATER){
            if(temp[y][x]>=100){
              grid[y][x]=WATER_VAPOR;temp[y][x]=120;vaporLife[y][x]=0;
            }
          } else if(grid[y][x]===WATER_VAPOR){
            if(vaporLife[y][x]>=vaporTransformThreshold||vaporLife[y][x]>=6){
              let count=0;
              for(let dy=-1;dy<=1;dy++){
                for(let dx=-1;dx<=1;dx++){
                  let ny=y+dy,nx=x+dx;
                  if(nx>=0&&nx<GRID_SIZE&&ny>=0&&ny<GRID_SIZE){
                    if(grid[ny][nx]===WATER_VAPOR&&vaporLife[ny][nx]>=vaporTransformThreshold){
                      count++;
                    }
                  }
                }
              }
              if(count>=3||vaporLife[y][x]>=6){
                grid[y][x]=CLOUD;temp[y][x]=50;cloudLife[y][x]=0;
              }
            }
          }
        }
      }
    }

    function transformCloudToWater(){
      for(let y=0;y<GRID_SIZE;y++){
        for(let x=0;x<GRID_SIZE;x++){
          if(grid[y][x]===CLOUD){
            if(temp[y][x]<10){
              grid[y][x]=WATER;temp[y][x]=20;
            } else if(cloudLife[y][x]>=cloudMaxLife[y][x]){
              grid[y][x]=WATER;temp[y][x]=20;cloudLife[y][x]=0;
            }
          }
        }
      }
    }

    function transformIceWater(){
      for(let y=0;y<GRID_SIZE;y++){
        for(let x=0;x<GRID_SIZE;x++){
          let e=grid[y][x], t=temp[y][x];
          if(e===WATER && t<0){
            grid[y][x]=ICE;temp[y][x]=-5;
          } else if(e===ICE && t>2){
            grid[y][x]=WATER;temp[y][x]=5;
          }
        }
      }
    }

    function transformFireToSmoke(){
      for(let y=0;y<GRID_SIZE;y++){
        for(let x=0;x<GRID_SIZE;x++){
          if(grid[y][x]===FIRE){
            if(fireLife[y][x]>=fireLifetime){
              grid[y][x]=SMOKE;temp[y][x]=80;
              smokeLife[y][x]=0;
              smokeMaxLife[y][x]=1+2*Math.random();
            } else {
              temp[y][x]=fireTemperature;
            }
          } else if(grid[y][x]===SMOKE){
            if(smokeLife[y][x]>=smokeMaxLife[y][x]){
              eraseCell(x,y);
            }
          }
        }
      }
    }

    function transformBurningWood(){
      for(let y=0;y<GRID_SIZE;y++){
        for(let x=0;x<GRID_SIZE;x++){
          if(grid[y][x]===BURNING_WOOD){
            sparkTimer[y][x]+=simulationTimeStep;
            let sparkLimit=0.2+0.1*Math.random();
            if(sparkTimer[y][x]>=sparkLimit){
              let nb=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
              shuffle(nb);
              for(let [dx,dy] of nb){
                let nx=x+dx, ny=y+dy;
                if(nx>=0&&nx<GRID_SIZE&&ny>=0&&ny<GRID_SIZE){
                  if(grid[ny][nx]===EMPTY){
                    grid[ny][nx]=FIRE;temp[ny][nx]=fireTemperature;fireLife[ny][nx]=0;
                    break;
                  }
                }
              }
              sparkTimer[y][x]=0;
            }
            burningWoodTime[y][x]+=simulationTimeStep;
            if(burningWoodTime[y][x]>=burnDuration){
              let r=Math.random();
              let newElem=(r<burnToAshChance)?ASH:FIRE;
              grid[y][x]=newElem;
              if(newElem===FIRE){
                temp[y][x]=fireTemperature; fireLife[y][x]=0;
              } else {
                temp[y][x]=50;
              }
            }
          }
        }
      }
    }

    function transformWoodIgnition(){
      for(let y=0;y<GRID_SIZE;y++){
        for(let x=0;x<GRID_SIZE;x++){
          if(grid[y][x]===FIRE){
            let nb=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
            for(let [dx,dy] of nb){
              let nx=x+dx, ny=y+dy;
              if(nx>=0&&nx<GRID_SIZE&&ny>=0&&ny<GRID_SIZE){
                let e=grid[ny][nx];
                if(e===WOOD){
                  grid[ny][nx]=BURNING_WOOD;burningWoodTime[ny][nx]=0;sparkTimer[ny][nx]=0;temp[ny][nx]=100;
                }
                if(e===OAK_LEAVES||e===OAK_BABY_LEAVES){
                  grid[ny][nx]=BURNING_LEAVES;sparkTimer[ny][nx]=0;temp[ny][nx]=fireTemperature;
                }
              }
            }
          }
        }
      }
    }

    function transformBurningLeaves(){
      for(let y=0;y<GRID_SIZE;y++){
        for(let x=0;x<GRID_SIZE;x++){
          if(grid[y][x]===BURNING_LEAVES){
            sparkTimer[y][x]+=simulationTimeStep;
            if(sparkTimer[y][x]>=burnDuration){
              let r=Math.random();
              let newElem=(r<0.5)?DEAD_PLANT:FIRE;
              grid[y][x]=newElem;
              if(newElem===FIRE){
                temp[y][x]=fireTemperature;fireLife[y][x]=0;
              } else {
                temp[y][x]=20;
              }
              let nb=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
              for(let [dx,dy] of nb){
                let nx=x+dx,ny=y+dy;
                if(nx>=0&&nx<GRID_SIZE&&ny>=0&&ny<GRID_SIZE){
                  let en=grid[ny][nx];
                  if(en===WOOD||en===OAK_LEAVES||en===OAK_BABY_LEAVES){
                    if(en===WOOD){
                      grid[ny][nx]=BURNING_WOOD;burningWoodTime[ny][nx]=0;sparkTimer[ny][nx]=0;temp[ny][nx]=fireTemperature;
                    } else {
                      grid[ny][nx]=BURNING_LEAVES;sparkTimer[ny][nx]=0;temp[ny][nx]=fireTemperature;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    function transformSandToGlass(){
      for(let y=0;y<GRID_SIZE;y++){
        for(let x=0;x<GRID_SIZE;x++){
          if(grid[y][x]===SAND && temp[y][x]>=glassTemp){
            grid[y][x]=GLASS;temp[y][x]=300;
          }
        }
      }
    }

    function transformDirtWetDirt(){
      let cpy=grid.map(r=>r.slice());
      for(let y=0;y<GRID_SIZE;y++){
        for(let x=0;x<GRID_SIZE;x++){
          let e=grid[y][x];
          if(e===DIRT){
            let nb=[[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]];
            for(let [dx,dy] of nb){
              let nx=x+dx, ny=y+dy;
              if(nx>=0&&nx<GRID_SIZE&&ny>=0&&ny<GRID_SIZE){
                if(grid[ny][nx]===WATER){
                  cpy[y][x]=WET_DIRT;temp[y][x]=20;
                  cpy[ny][nx]=EMPTY;temp[ny][nx]=null;
                  break;
                }
              }
            }
          } else if(e===WET_DIRT){
            if(temp[y][x]>=wetDirtEvapTemp){
              cpy[y][x]=DIRT;temp[y][x]=20;
            } else {
              let foundWater=null,foundDirt=null;
              let nb=[[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]];
              for(let [dx,dy] of nb){
                let nx=x+dx, ny=y+dy;
                if(nx>=0&&nx<GRID_SIZE&&ny>=0&&ny<GRID_SIZE){
                  if(grid[ny][nx]===WATER) foundWater=[nx,ny];
                  if(grid[ny][nx]===DIRT) foundDirt=[nx,ny];
                }
              }
              if(foundWater&&foundDirt){
                let [wx,wy]=foundWater, [dx2,dy2]=foundDirt;
                cpy[dy2][dx2]=WET_DIRT;temp[dy2][dx2]=20;
                cpy[wy][wx]=EMPTY;temp[wy][wx]=null;
              }
            }
          }
        }
      }
      grid=cpy;
    }

    function transformSandWetSand(){
      for(let y=0;y<GRID_SIZE;y++){
        for(let x=0;x<GRID_SIZE;x++){
          if(grid[y][x]===SAND){
            let nb=[[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]];
            for(let [dx,dy] of nb){
              let nx=x+dx, ny=y+dy;
              if(nx>=0&&nx<GRID_SIZE&&ny>=0&&ny<GRID_SIZE){
                if(grid[ny][nx]===WATER){
                  grid[y][x]=WET_SAND;temp[y][x]=20;
                  break;
                }
              }
            }
          } else if(grid[y][x]===WET_SAND){
            if(temp[y][x]>=wetDirtEvapTemp){
              grid[y][x]=SAND;temp[y][x]=20;
            }
          }
        }
      }
    }

    function transformFlourToDough(){
      let cpy=grid.map(r=>r.slice());
      for(let y=0;y<GRID_SIZE;y++){
        for(let x=0;x<GRID_SIZE;x++){
          if(grid[y][x]===FLOUR){
            let nb=[[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]];
            for(let [dx,dy] of nb){
              let nx=x+dx,ny=y+dy;
              if(nx>=0&&nx<GRID_SIZE&&ny>=0&&ny<GRID_SIZE){
                if(grid[ny][nx]===WATER){
                  cpy[y][x]=DOUGH;temp[y][x]=25;
                  cpy[ny][nx]=EMPTY;temp[ny][nx]=null;
                  break;
                }
              }
            }
          }
        }
      }
      grid=cpy;
    }

    function transformDoughToBread(){
      for(let y=0;y<GRID_SIZE;y++){
        for(let x=0;x<GRID_SIZE;x++){
          if(grid[y][x]===DOUGH && temp[y][x]>=doughBakeTemp){
            grid[y][x]=BREAD;temp[y][x]=30;
          }
        }
      }
    }

    function transformBreadToAshIfHot(){
      for(let y=0;y<GRID_SIZE;y++){
        for(let x=0;x<GRID_SIZE;x++){
          if(grid[y][x]===BREAD && temp[y][x]>=breadBurnTemp){
            grid[y][x]=ASH;temp[y][x]=50;
          }
        }
      }
    }


    /*******************************************
     * CATEGORY / SEARCH FILTERING
     *******************************************/
    categoryButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        categoryButtons.forEach(b => b.classList.remove('selectedCat'));
        btn.classList.add('selectedCat');
        activeCategory = btn.getAttribute('data-category');
        filterTools();
      });
    });
    toolSearch.addEventListener('input', filterTools);

    function filterTools(){
      const searchVal = toolSearch.value.trim().toLowerCase();
      Array.from(toolElements).forEach(tool => {
        const toolName = tool.getAttribute('data-tool') || '';
        const cats = (tool.getAttribute('data-cat') || '').toLowerCase().split(',');
        let inCat = false;
        if(activeCategory === 'all'){
          inCat = true;
        } else {
          if(cats.includes(activeCategory)) {
            inCat = true;
          }
        }
        let inSearch = true;
        if(searchVal){
          if(!toolName.toLowerCase().includes(searchVal)){
            inSearch = false;
          }
        }
        if(inCat && inSearch){
          tool.style.display = 'flex';
        } else {
          tool.style.display = 'none';
        }
      });
    }
    filterTools();