function calc(hitnum, variable)
{
	var skilllv = parseInt(document.getElementById("skilllv").value);
	var matk = parseInt(document.getElementById("matk").value);
	var amp = parseInt(document.getElementById("amp").value);
	amp = amp / 2;
	var atk_elem_fire = parseInt(document.getElementById("atk_elem_fire").value);
	var atk_elem_ice = parseInt(document.getElementById("atk_elem_ice").value);
	var atk_elem_lightning = parseInt(document.getElementById("atk_elem_lightning").value);
	var atk_elem_poison = parseInt(document.getElementById("atk_elem_poison").value);
	var atk_elem_earth = parseInt(document.getElementById("atk_elem_earth").value);
	var atk_elem_holy = parseInt(document.getElementById("atk_elem_holy").value);
	var atk_elem_dark = parseInt(document.getElementById("atk_elem_dark").value);
	var atk_elem_psy = parseInt(document.getElementById("atk_elem_psy").value);
	var atk_type = parseInt(document.getElementById("atk_type").value);
	var useagni = document.getElementById("useagni").checked;
	var usequickcast = document.getElementById("usequickcast").checked;
	var enhance = parseInt(document.getElementById("enhance").value);
	enhance = enhance / 100 + 1;
	var bonus = parseInt(document.getElementById("bonus").value);
	var mdef = parseInt(document.getElementById("mdef").value);
	var fire = false;
	var ice = false;
	var enemy_elems = document.getElementsByName("enemy_elem");
	var enemy_elem = "";
	for(i = 0; i < enemy_elems.length; i++)
	{
		if(enemy_elems[i].checked)
		{
			enemy_elem = enemy_elems[i].value;
			break;
		}
	}
	var atk_elem = calc_attak_elem(enemy_elem, atk_elem_fire, atk_elem_ice, atk_elem_lightning, atk_elem_poison, atk_elem_earth, atk_elem_holy, atk_elem_dark, atk_elem_psy);
	var lv_penalty = calc_LevelPenalty(0, 0);
	var T2 = calc_T2(enemy_elem, useagni, usequickcast);
	if(variable == "")
	{
		var damage = calc_fb(matk, skilllv, amp, mdef, 0, lv_penalty, 0, atk_elem, atk_type, T2, enhance, bonus);
		var totaldamage = hitnum * damage;
		return totaldamage;
	}
	else if(variable == "enhance")
	{
		var damages = [];
		for(i = 0; i <= 100; i++)
		{
			var new_enhance = i / 100 + 1;
			var totaldamage = calc_fb(matk, skilllv, amp, mdef, 0, lv_penalty, 0, atk_elem, atk_type, T2, new_enhance, bonus) * hitnum;
			damages.push(totaldamage);
		}
		return damages;
	}
	else if(variable == "matk")
	{
		var damages = [];
		for(i = -20; i <= 20; i++)
		{
			var new_matk= (i * 50) + matk;
			var totaldamage = calc_fb(new_matk, skilllv, amp, mdef, 0, lv_penalty, 0, atk_elem, atk_type, T2, enhance, bonus) * hitnum;
			damages.push(totaldamage);
		}
		return damages;
	}
	
}

function test()
{
	var T2 = calc_T2(false, false, true, true);
	alert(calc_fb(1453, 15, 0, 10, 0, 1, 0, 497+81, 0, T2, 1.5, 0));
}

// 属性攻撃力計算
function calc_attak_elem(enemyelem, fire, ice, lightning, poision, earth, holy, dark, psy)
{
	var firelist = [0.5, 1.5, 1, 1, 1, 1, 1, 1];
	var icelist = [1.5, 0.5, 1, 1, 1, 1, 1, 1];
	var lightninglist = [1, 2, 0.5, 1, 0.5, 1, 1, 1];
	var poisonlist = [1, 1, 1, 0.5, 1.5, 1, 1, 1];
	var earthlist = [1, 1, 1.5, 0.5, 1, 1, 1, 1];
	var holylist = [1, 1, 1, 1, 1, 1, 2, 1.25];
	var darklist = [1, 1, 1, 1, 1, 2, 1, 1.25];
	var aisyo = {
		"fire":firelist, 
		"ice":icelist, 
		"lightning":lightninglist, 
		"poison":poisonlist, 
		"earth":earthlist, 
		"holy":holylist, 
		"dark":darklist, 
	};

	var elements = [fire, ice, lightning, poision, earth, holy, dark, psy];
	attack_elem = 0;
	for(i = 0; i < elements.length; i++)
	{
		attack_elem += elements[i] * aisyo[enemyelem][i];
	}
	return attack_elem;
}

// 属性相性係数計算
function calc_T2(enemy_elem, useAgni, useQuickCast)
{
	var T2 = 1;
	if(enemy_elem == "fire") T2 -= 0.5;
	if(enemy_elem == "ice") T2 += 0.5;
	if(useAgni) T2 += 2.8;
	if(useQuickCast) T2 += 0.5;
	return T2;
}

// レベルペナルティー計算（未実装）
function calc_LevelPenalty(yourLv, enemyLv)
{
	return 1;
}

// ファイアボール専用ダメージ計算
function calc_fb(
				MATK, SKILLLV, AMP, DEF, DEF_DEBUFF, LV_PENALTY, RES_ELEM,
				ATK_ELEM, ATK_TYPE, T2, ENHANCE, BONUS
				)
{
	var skilldamage = [74, 92, 109, 127, 145, 163, 181, 199, 217, 234, 252, 270, 288, 306, 324, 342, 360];
	return calcdamage(
					MATK, skilldamage[SKILLLV - 1], AMP, 1, DEF, DEF_DEBUFF, LV_PENALTY,
					RES_ELEM, 1, 0, ATK_ELEM, ATK_TYPE, 
					1, T2, 1, ENHANCE, BONUS
					);
}

// 汎用ダメージ計算
function calcdamage(
					ATK, ATK_SKILL, AMP, T0, DEF, DEF_DEBUFF, LV_PENALTY, 
					RES_ELEM, CRIT, CRITATK, ATK_ELEM, ATK_TYPE, 
					T1, T2, T3, ENHANCE, BONUS
					)
{
	var damage = (((ATK + ATK_SKILL + AMP) * T0 - ((DEF - DEF_DEBUFF) * LV_PENALTY + RES_ELEM)) * CRIT +
				 CRITATK + ATK_ELEM + ATK_TYPE) * T1 * T2 * T3 * ENHANCE + BONUS;
	damage = Math.floor(damage);
	if(damage < 1)
	{
		damage = 1;
	}
	return damage;
}