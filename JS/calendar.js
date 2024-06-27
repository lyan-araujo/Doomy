let calendario  = {
    _dia_atual: null,
    _day_wait: null,
    _horario_atual: null,
    horarios: {
        _aberto: 10,
        _fechado: 18
    },

    set dia_atual(new_value) {
        this._dia_atual  = new_value;
        atualizaDiaAtual(new_value);
    },
    get dia_atual() {
        return this._dia_atual;
    },

    set d_wait(new_value) {
        this._day_wait  = new_value;
        
        atualizaDayWait(new_value);
    },
    get d_wait() {
        return this._day_wait;
    },

    set h_atual(new_value) {
        this._horario_atual = new_value;
        atualizaHorario(new_value);
    },
    get h_atual() {
        return this._horario_atual;
    },

    get h_aberto() {
        return this.horarios._aberto;
    } ,
    get h_fechado() {
        return this.horarios._fechado;
    }
}

function atualizaDiaAtual(day_value) {
    const _dia_marcado    = document.querySelector('.daycheck') ?? null;
    const _dia_atual  = document.querySelector(`[data-day="${day_value}"]`);

    if(_dia_marcado !== _dia_atual) {
        if(_dia_marcado !== null) {
            _dia_marcado.classList.remove('daycheck');
        }

        _dia_atual.classList.add('daycheck');
        return;
    }
}

function atualizaHorario(hour_value) {
    if(hour_value < calendario.h_aberto) {
        calendario.d_wait   = calendario.dia_atual;

    }else if(hour_value > calendario.h_fechado) {
        calendario.d_wait   = (calendario.dia_atual == 6 ? 1 : (calendario.dia_atual + 1));
    } else {
        calendario.d_wait   = null;
    }
}

function atualizaDayWait(wait_value) {
    let _day_wait   = document.querySelector('.wait') ?? null;
    let _now_day_wait   = wait_value !== null ? document.querySelector(`[data-day="${wait_value}"]`) : null;

    if(_day_wait !== _now_day_wait) {
        if(_day_wait != null) {
            _day_wait.classList.remove('wait');
        }

        if(_now_day_wait != null) {
            _now_day_wait.classList.add('wait');
        }
    }
}

function atualizaCalendario() {
    let agora   = new Date();
    calendario.dia_atual = agora.getDay(); 
    calendario.h_atual  = agora.getHours();

    // timer 
    let meta    = new Date(agora);
    if(calendario.h_atual >= 0 && calendario.h_atual < calendario.h_aberto) {
        meta.setHours(calendario.h_aberto, 0, 0, 500);
    }

    if(calendario.h_atual >= calendario.h_aberto && calendario.h_atual < calendario.h_fechado) {
        meta.setHours(calendario.h_fechado, 0, 0, 500);
    }

    if(calendario.h_atual >= calendario.h_fechado) {
        meta.setDate(agora.getDate() + 1);
        meta.setHours(0,0,0,500);
    }

    console.log(meta - agora);
    setInterval(() => {
        atualizaCalendario();
    }, (meta - agora));
}

window.onload   = function() {
    atualizaCalendario();
    document.querySelector("#week_container").removeAttribute('hidden');
}