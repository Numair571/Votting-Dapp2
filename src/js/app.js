App={
    web3Provider: null,
    contracts: {},

    init: async function() {
        return await App.initWeb3();
    },

    initWeb3: async function(){
        if(window.web3){
            App.web3Provider=window.web3.currentProvider;
        } else {
            App.web3Provider=new Web3.providers.HttpProvider("http://127.0.0.1:7545");
        }

        web3=new Web3(App.web3Provider);
        return App.initContract();
    },

    initContract: function(){
        $.getJSON('voting.json',function(data){
            var votingArtifact=data;
            App.contracts.voting=TruffleContract(votingArtifact);
            App.contracts.voting.setProvider(App.web3Provider);
            return App.displayVotes();
        })
            return App.bindEvents();
    },

    displayVotes: function(){
        // viewvotes
        var votingInstance;
        App.contracts.voting.deployed().then(function(instance){
            votingInstance=instance;
            return votingInstance.viewvotes.call();
        }).then(function(votes){
            console.log(votes);
            document.getElementById('v1').innerHTML=votes[0]['c'][0];
            document.getElementById('v2').innerHTML=votes[1]['c'][0];
            document.getElementById('v3').innerHTML=votes[2]['c'][0];
        }).catch(function(err){
            console.log(err.message);
        })
    },

    bindEvents: function() {
        // configure buttons
        $(document).on('click','.btn-vote',App.castVote);

    },

    castVote: function(event){
        // castvote
        event.preventDefault();

        var votingInstance;
        var id=parseInt($(event.target).data('id'));
        console.log(id);

        web3.eth.getAccounts(function(err,accounts){
            if(err)
                console.log(err);
            var account=accounts[0];
            console.log(account);

            App.contracts.voting.deployed().then(function(instance){
                votingInstance=instance;
                return votingInstance.castvote(id,{from:account});
            }).then(function(result){
                console.log(result);
                document.getElementById("add").innerHTML=account;
                return App.displayVotes();
            }).catch(function(err){
                console.log(err,err.message);
            })
        })

    }
}

$(function(){
    $(window).load(function(){
        App.init();
    })
})